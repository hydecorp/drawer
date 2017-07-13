// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import 'core-js/fn/array/find';
import 'core-js/fn/function/bind';
import 'core-js/fn/object/assign';

import { componentMixin, setup, fire, setState,
  MODERNIZR_TESTS as COMPONENT_MODERNIZER_TESTS } from 'y-component/src/component';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { never } from 'rxjs/observable/never';

import { _do as effect } from 'rxjs/operator/do';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { mapTo } from 'rxjs/operator/mapTo';
import { merge as mergeWith } from 'rxjs/operator/merge';
import { pairwise } from 'rxjs/operator/pairwise';
import { repeatWhen } from 'rxjs/operator/repeatWhen';
import { sample } from 'rxjs/operator/sample';
import { share } from 'rxjs/operator/share';
import { skipWhile } from 'rxjs/operator/skipWhile';
import { startWith } from 'rxjs/operator/startWith';
import { switchMap } from 'rxjs/operator/switchMap';
import { take } from 'rxjs/operator/take';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { timestamp } from 'rxjs/operator/timestamp';
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';

import { createTween, linearTween } from '../common';

export const MODERNIZR_TESTS = [
  ...COMPONENT_MODERNIZER_TESTS,
  // 'touchevents', // optional
  // 'pointerevents', // windows (phone) ???
  // 'willchange', // optional
  'eventlistener',
  'queryselector',
  'requestanimationframe',
  'classlist',
  'opacity',
  'csstransforms',
  'csspointerevents',
];

// TODO: export all symbols, always?
export { setup };

// TODO: make configurable?

const TRANSITION_DURATION = 200; // ms

// Min velocity of the drawer (in px/ms) to make it snap to open/close the drawer.
const VELOCITY_THRESHOLD = 0.2;

// How much (in px) does the thumb/mouse need to move,
// before we are confident about making a dicision regarding the movement's direction.
const SLIDE_THRESHOLD = 10;

// TODO: rename
const MAGIC_MIKE = 0.5;

// If Symbol isn't supported, just use underscore naming convention for private properties.
// We don't need advanced features of Symbol.
// TODO: does rxjs use symbol anyway?
const Symbol = global.Symbol || (x => `_${x}`);

// We use symbols for all internal stuff, because this is a mixin which could
// potentially be used in a lot of contexts, where names might conflict.
// Also, we don't want users to accidentially modify internal state.
const persistentObs = Symbol('persistentObs');
const openedObs = Symbol('openedObs');
const preventDefaultObs = Symbol('preventDefaultObs');
const mouseEventsObs = Symbol('mouseEventsObs');

const animateToObs = Symbol('animateToObs');
const drawerWidth = Symbol('drawerWidth');

const scrimEl = Symbol('scrimEl');
const contentEl = Symbol('contentEl');
const scrollEl = Symbol('scrollEl');

// Using shorthands for common functions
const assign = ::Object.assign;
const abs = ::Math.abs;
const min = ::Math.min;
const max = ::Math.max;

// Like `filter`, but takes a stream of booleans instead of a predicate.
// Similar to `pauseable`, but will not unsubscribe from the source observable.
// NOTE: Writing a custom observabele would probably be a more efficient way of doing this
function filterWith(p$) {
  if (process.env.DEBUG && !p$) throw Error();
  return this::withLatestFrom(p$)::filter(([, p]) => p)::map(([x]) => x);
}

// Similar to `filterWith`, but will unsubscribe for the source observable
// when `pauser$` emits `true`, and re-subscribe when `pauser$` emits `false`.
// Note that the true/false are interpreted opposite to the way filterWith interprets them.
// (filter true? = let pass. paused true? = don't let pass).
function pauseable(pauser$) {
  if (process.env.DEBUG && !pauser$) throw Error();
  return pauser$::switchMap(paused => (paused ? Observable::never() : this));
}

// function filterWithAll(p$, ...others) {
//   if (process.env.DEBUG && !p$) throw Error();
//   else if (others.length === 0) {
//     return this::withLatestFrom(p$)::filter(([, p]) => p)::map(([x]) => x);
//   } else {
//     return this::withLatestFrom(p$, ...others)
//       ::filter(([, ...ps]) => ps.every(p => p))
//       ::map(([x]) => x);
//   }
// }

// function pauseableAll(pauser$, ...others) {
//   if (process.env.DEBUG && !pauser$) throw Error();
//   if (others.length === 0) {
//     return pauser$::switchMap(paused => (paused ? Observable::never() : this));
//   } else {
//     return pauser$::combineLatest(...others)
//       ::switchMap(states => (states.some(s => s) ? Observable.never() : this));
//   }
// }

function cacheDOMElements() {
  this[scrimEl] = this.root.querySelector('.y-drawer-scrim');
  this[contentEl] = this.root.querySelector('.y-drawer-content');
}

// Given a x coordinate and the current drawer width,
// determine whether it is within range to initiate an sliding interaction.
function isInRange(clientX) {
  return clientX > this.edgeMargin && clientX < this[drawerWidth] * MAGIC_MIKE;
}

// Based on current velocity and position of drawer, will the drawer be open, or slide back?
// TODO: could incorporate the current open state of the drawer
function calcWillOpen(velocity, translateX) {
  if (velocity > VELOCITY_THRESHOLD) {
    return true;
  } else if (velocity < -VELOCITY_THRESHOLD) {
    return false;
  } else if (translateX >= this[drawerWidth] / 2) {
    return true;
  } else {
    return false;
  }
}

// Calcuate the current position of the drawer,
// by taking the different between the current and starting postion of the thumb,
// then applying the difference to the starting position of the drawer.
// This way, we avoid snapping the drawer to the thumb, when catching it mid-animtion.
// Will also clip the position at 0 and the width of the drawer.
function calcTranslateX(clientX, startX, startTranslateX) {
  const deltaX = clientX - startX;
  const translateX = startTranslateX + deltaX;
  return max(0, min(this[drawerWidth], translateX));
}

// Since part of the drawer could be visible,
// the width that is "movable" is less than the complete drawer width
// and given by
function getMovableDrawerWidth() {
  return -this[contentEl].offsetLeft;
}

// Side effects happening before a user interaction (sliding).
function prepInteraction() {
  this[contentEl].style.willChange = 'transform';
  this[scrimEl].style.willChange = 'opacity';
  this[contentEl].classList.remove('y-drawer-opened');
  this[drawerWidth] = this::getMovableDrawerWidth();
}

// Cleanup code after a completed interaction.
function cleanupInteraction(opened) {
  this[contentEl].style.willChange = '';
  this[scrimEl].style.willChange = '';

  if (opened) {
    // document.body.style.overflowY = 'hidden';
    this[scrimEl].style.pointerEvents = 'all';
    this[contentEl].classList.add('y-drawer-opened');
  } else {
    if (this[scrollEl]) this[scrollEl].style.overflowY = ''; // TODO: allow scrolling earlier

    this[scrimEl].style.pointerEvents = '';
    this[contentEl].classList.remove('y-drawer-opened');
  }

  this[fire]('transitioned', opened);
}

// The end result of pretty much everything in this component is
// to modify the `transform` of the content, and the `opacity` of the scrim.
function updateDOM(translateX) {
  this[contentEl].style.transform = `translateX(${translateX}px)`;
  this[scrimEl].style.opacity = translateX / this[drawerWidth];
}

function getStartObservable() {
  return Observable::merge(this[mouseEventsObs], this[preventDefaultObs])::switchMap(() => {
    const touchstart$ = Observable::fromEvent(document, 'touchstart', {
      passive: !this.preventDefault,
    })
      ::filter(({ touches }) => touches.length === 1)
      ::map(({ touches }) => touches[0]);

    if (!this.mouseEvents) {
      return touchstart$;
    } else {
      const mousedown$ = Observable::fromEvent(document, 'mousedown', {
        passive: !this.preventDefault,
      });

      return touchstart$::mergeWith(mousedown$);
    }
  });
}

function getMoveObservable(start$, end$) {
  const { find } = Array.prototype;

  return Observable::merge(this[mouseEventsObs], this[preventDefaultObs])::switchMap(() => {
    const touchmove$ = Observable::fromEvent(document, 'touchmove', {
      passive: !this.preventDefault,
    })
      ::withLatestFrom(start$)
      ::map(([e, { identifier: startIdentifier }]) =>
        // TODO: what if the finger is no longer available?
        assign(e.touches::find(t => t.identifier === startIdentifier), { e }));

    if (!this.mouseEvents) {
      return touchmove$;
    } else {
      const mousemove$ = Observable::fromEvent(document, 'mousemove', {
        passive: !this.preventDefault,
      })
        ::pauseable(Observable::merge(start$::mapTo(false), end$::mapTo(true)))
        ::map(e => assign(e, { e }));

      return touchmove$::mergeWith(mousemove$);
    }
  });
}

function getEndObservable() {
  return Observable::merge(this[mouseEventsObs], this[preventDefaultObs])::switchMap(() => {
    const touchend$ = Observable::fromEvent(document, 'touchend', {
      passive: !this.preventDefault,
    })
      ::filter(({ touches }) => touches.length === 0);

    if (!this.mouseEvents) {
      return touchend$;
    } else {
      const mouseup$ = Observable::fromEvent(document, 'mouseup', {
        passive: !this.preventDefault,
      });

      return touchend$::mergeWith(mouseup$);
    }
  });
}

function getIsSlidingObservable(move$, start$) {
  if (!this.preventDefault) {
    return move$::withLatestFrom(start$)
      ::skipWhile(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startY - clientY) < SLIDE_THRESHOLD && abs(startX - clientX) < SLIDE_THRESHOLD)
      ::map(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startX - clientX) >= abs(startY - clientY));
  } else {
    // Logic needs to be slightly different when using preventDefault:
    // iOS Safari will ignore any call to preventDefault except the one on the first move event,
    // so we have to make a decision immediately.
    // Luckily, Safari will not fire a move event until the thumb has travelled a minium distance,
    // so that the decision is not (too) random.
    return move$::withLatestFrom(start$)
      ::map(([{ clientX, clientY, e }, { clientX: startX, clientY: startY }]) => {
        const isSliding = abs(startX - clientX) >= abs(startY - clientY);
        if (isSliding) {
          if (this.preventDefault) e.preventDefault();
          if (this[scrollEl]) this[scrollEl].style.overflowY = 'hidden';
        }
        return isSliding;
      });
  }
}

function setupObservables() {
  this[openedObs] = new Subject();
  this[persistentObs] = new Subject();
  this[preventDefaultObs] = new Subject();
  this[mouseEventsObs] = new Subject();
  this[animateToObs] = new Subject();

  const persistent$ = this[persistentObs]::share();

  // We use this inside `defer` to reference observables that haven't been defined yet.
  const ref = {};

  this[drawerWidth] = this::getMovableDrawerWidth();

  const start$ = this::getStartObservable()
    ::pauseable(persistent$)
    ::share();

  // As long as the scrim is visible, the user can still "catch" the drawer
  const isScrimVisible$ = Observable::defer(() =>
    ref.translateX$::map(translateX => translateX > 0));

  const isAnimating$ = Observable::defer(() =>
    ref.translateX$::map(translateX => translateX < this[drawerWidth]));

  // Indicates whether the touch positon is within the range (x-axis)
  const isInRange$ = start$
    ::withLatestFrom(isScrimVisible$)
    ::map(([{ clientX }, isScrimVisible]) =>
      isScrimVisible || this::isInRange(clientX))
    ::effect((inRange) => { if (inRange) this::prepInteraction(); })
    ::share();

  const end$ = this::getEndObservable()
    ::pauseable(persistent$) // can unsubscribe when `persistent` is true
    ::filterWith(isInRange$)
    ::share();

  const move$ = this::getMoveObservable(start$, end$)
    ::pauseable(persistent$) // can unsubscribe when `persistent` is true
    ::filterWith(isInRange$) // MUST NOT unsubscribe (b/c of how `preventDefault` in Safari works)
    ::share();

  // *For every interaction*, determine whether it is a sliding (y-axis),
  // or scrolling (x-axis) motion.
  const isSliding$ = this::getIsSlidingObservable(move$, start$)
    ::take(1)
    ::startWith(undefined)
    ::repeatWhen(() => end$);

  ref.translateX$ = Observable::defer(() => Observable::merge(
      ref.tween$,
      move$
        ::filterWith(isSliding$)
        ::effect(({ e }) => { if (this.preventDefault) e.preventDefault(); })
        ::withLatestFrom(start$, ref.startTranslateX$)
        ::map(([{ clientX }, { clientX: startX }, startTranslateX]) =>
          this::calcTranslateX(clientX, startX, startTranslateX)),
      this[openedObs]
        ::map(opened => (opened ? this[drawerWidth] : 0)) // TODO: drawerWdith can be outdated...
        ::effect(this::cleanupInteraction)))
    ::share();

  // The `translateX` value at the start of an interaction.
  // Typically, this would be either 0 or `drawerWidth`, but since the user can initiate
  // an interaction *during an animation*, it can also be every value inbetween.
  ref.startTranslateX$ = ref.translateX$::sample(start$);

  // The current velocity of the slider
  const velocity$ = ref.translateX$
    ::timestamp()
    ::pairwise()
    ::map(([{ value: x, timestamp: time },
            { value: prevX, timestamp: prevTime }]) =>
      (x - prevX) / (time - prevTime))
    ::startWith(0);

  ref.tween$ = Observable::merge(
      end$
        ::withLatestFrom(ref.translateX$, velocity$)
        ::map(([, translateX, velocity]) =>
          this::calcWillOpen(velocity, translateX)),
      this[animateToObs]
        ::effect(this::prepInteraction))
    ::effect((willOpen) => { this[setState]('opened', willOpen); })
    ::withLatestFrom(ref.translateX$)
    ::switchMap(([opened, translateX]) => {
      const endTranslateX = (opened ? 1 : 0) * this[drawerWidth];
      const diffTranslateX = endTranslateX - translateX;
      return createTween(linearTween, translateX, diffTranslateX, TRANSITION_DURATION)
        ::effect(null, null, () => this::cleanupInteraction(opened))
        ::takeUntil(start$);
    });

  // The end result is always to update the (shadow) DOM.
  ref.translateX$.subscribe(translateX => this::updateDOM(translateX));

  // A click on the scrim should close the drawer, but only when the drawer is fully extended.
  // Otherwise it's possible to accidentially close the drawer during sliding/animating.
  // TODO: this still happens with mouseevents
  Observable::fromEvent(this[scrimEl], 'click')
    ::pauseable(isAnimating$)
    .subscribe(() => { this.close(); });

  // Other than preventing sliding, setting `persistent` to `true` will also hide the scrim.
  persistent$.subscribe((persistent) => {
    this[scrimEl].style.display = persistent ? 'none' : 'block';
  });

  // These could be useful at some point (don't forget to `share` dep obs)
  // const isScrolling$ = isSliding$::map(x => (x === undefined ? undefined : !x));
  // const hasStartedMoving$ = isSliding$
  //   ::map(isSliding => isSliding !== undefined)
  //   ::share();
}

export function drawerMixin(C) {
  return class extends componentMixin(C) {
    static get componentName() {
      return 'y-drawer';
    }

    static get defaults() {
      return {
        opened: false,
        persistent: false,
        scrollSelector: 'body',
        edgeMargin: 0,
        preventDefault: false,
        mouseEvents: false,
      };
    }

    static get sideEffects() {
      return {
        opened(x) { this[openedObs].next(x); },
        persistent(x) { this[persistentObs].next(x); },
        preventDefault(x) { this[preventDefaultObs].next(x); },
        mouseEvents(x) { this[mouseEventsObs].next(x); },
        scrollSelector(scrollSelector) {
          this[scrollEl] = document.querySelector(scrollSelector);
        },
      };
    }

    // @override
    [setup](el, props) {
      super[setup](el, props);

      this::cacheDOMElements();
      this::setupObservables();

      this[openedObs].next(this.opened);
      this[persistentObs].next(this.persistent);
      this[preventDefaultObs].next(this.preventDefault);
      this[mouseEventsObs].next(this.mouseEvents);

      this[fire]('attached');

      return this;
    }

    open(animated = true) {
      if (animated) this[animateToObs].next(true);
      else this.opened = true;
      return this;
    }

    close(animated = true) {
      if (animated) this[animateToObs].next(false);
      else this.opened = false;
      return this;
    }

    toggle(animated = true) {
      if (animated) this[animateToObs].next(!this.opened);
      else this.opened = !this.opened;
      return this;
    }

    animateTo(opened) {
      this[animateToObs].next(opened);
      return this;
    }

    jumpTo(opened) {
      this.opened = opened;
      return this;
    }
  };
}
