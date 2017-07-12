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

import {
  componentMixin,
  MODERNIZR_TESTS as COMPONENT_MODERNIZER_TESTS,
} from 'y-component/src/component';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
// import { never } from 'rxjs/observable/never';
// import { of } from 'rxjs/observable/of';
// import { zip } from 'rxjs/observable/zip';

// import { _catch as recover } from 'rxjs/operator/catch';
import { _do as effect } from 'rxjs/operator/do';
// import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { mapTo } from 'rxjs/operator/mapTo';
// import { mergeMap } from 'rxjs/operator/mergeMap';
import { merge as mergeWith } from 'rxjs/operator/merge';
import { pairwise } from 'rxjs/operator/pairwise';
import { repeatWhen } from 'rxjs/operator/repeatWhen';
import { sample } from 'rxjs/operator/sample';
// import { scan } from 'rxjs/operator/scan';
import { share } from 'rxjs/operator/share';
import { skipWhile } from 'rxjs/operator/skipWhile';
import { startWith } from 'rxjs/operator/startWith';
import { switchMap } from 'rxjs/operator/switchMap';
import { take } from 'rxjs/operator/take';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { timestamp } from 'rxjs/operator/timestamp';
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';

import { createTween, linearTween } from '../common';

export const MODERNIZR_TESTS = Object.assign({
  // touchevents: true, // optional
  // pointerevents: true, // windows (phone) ???
  // willchange: true, // optional
  eventlistener: true,
  queryselector: true,
  requestanimationframe: true,
  classlist: true,
  opacity: true,
  csstransforms: true,
  csspointerevents: true,
}, COMPONENT_MODERNIZER_TESTS);

const Symbol = global.Symbol || (x => `_${x}`); // TODO: does rxjs use symbol anyway?
const PERSISTENT = Symbol('persistentObservable');
const OPENED = Symbol('openedObservable');
const ANIMATE_TO = Symbol('animateToObservable');
const SCRIM = Symbol('scrimEl');
const CONTENT = Symbol('contentEl');
const SCROLL = Symbol('scrollEl');

const VELOCITY_THRESHOLD = 0.2; // px/ms
const SLIDE_THRESHOLD = 10; // px

const abs = ::Math.abs;
const min = ::Math.min;
const max = ::Math.max;
const assign = ::Object.assign;

// Like `filter`, but takes a stream of booleans instead of a predicate.
// Similar to `pauseable`, but will not unsubscribe from the source observable.
// NOTE: Writing a custom observabele would probably be a more efficient way of doing this
function filterWith(p$) {
  return this::withLatestFrom(p$)
      ::filter(([, p]) => p)
      ::map(([x]) => x);
}

// function filterWithAll(...p$s) {
//   return this::withLatestFrom(...p$s)
//       ::filter(([, ...ps]) => ps.every(p => !!p))
//       ::map(([x]) => x);
// }

// Similar to `filterWith`, but will unsubscribe for the source observable
// when `pauser$` emits `true`, and re-subscribe when `pauser$` emits `false`.
// function pauseable(pauser$) {
//   return pauser$::switchMap(paused => (paused ? Observable::never() : this));
// }

function cacheDOMElements() {
  this[SCRIM] = this.root.querySelector('.y-drawer-scrim');
  this[CONTENT] = this.root.querySelector('.y-drawer-content');
}

function isInRange(clientX, drawerWidth) {
  return clientX > this.edgeMargin && clientX < drawerWidth / 2;
}

// Based on current velocity and position of drawer, will the drawer be open, or snap back?
// TODO: could incorporate the current open state of the drawer
function calcWillOpen(velocity, translateX, drawerWidth) {
  if (velocity > VELOCITY_THRESHOLD) {
    return true;
  } else if (velocity < -VELOCITY_THRESHOLD) {
    return false;
  } else if (translateX >= drawerWidth / 2) {
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
function calcTranslateX(clientX, startX, startTranslateX, drawerWidth) {
  const deltaX = clientX - startX;
  const translateX = startTranslateX + deltaX;
  return max(0, min(drawerWidth, translateX));
}

function prepInteraction() {
  this[CONTENT].style.willChange = 'transform';
  this[SCRIM].style.willChange = 'opacity';
  this[CONTENT].classList.remove('y-drawer-opened');
  // this.drawerWidth = this.getMovableDrawerWidth();
}

function cleanupInteraction(opened) {
  this[CONTENT].style.willChange = '';
  this[SCRIM].style.willChange = '';

  if (opened) {
    // document.body.style.overflowY = 'hidden';
    this[SCRIM].style.pointerEvents = 'all';
    this[CONTENT].classList.add('y-drawer-opened');
  } else {
    // TODO: allow scrolling earlier
    if (this[SCROLL]) this[SCROLL].style.overflowY = '';

    this[SCRIM].style.pointerEvents = '';
    this[CONTENT].classList.remove('y-drawer-opened');
  }
}

function getMovableDrawerWidth() {
  // Since part of the drawer could be visible,
  // the width that is "movable" is less than the complete drawer width
  // and given by
  return -this[CONTENT].offsetLeft;
}

function updateDOM(translateX, drawerWidth) {
  this[CONTENT].style.transform = `translateX(${translateX}px)`;
  this[SCRIM].style.opacity = translateX / drawerWidth;
}

function getStartObservable() {
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
}

function getMoveObservable(start$, end$) {
  const { find } = Array.prototype;

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
      ::filterWith(Observable::merge(start$::mapTo(true), end$::mapTo(false)))
      ::map(e => assign(e, { e }));

    return touchmove$::mergeWith(mousemove$);
  }
}

function getEndObservable() {
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
          if (this[SCROLL]) this[SCROLL].style.overflowY = 'hidden';
        }
        return isSliding;
      });
  }
}

function setupObservables() {
  this[OPENED] = new Subject();
  this[ANIMATE_TO] = new Subject();
  // this[PERSISTENT] = new Subject();

  const opened$ = this[OPENED]
    ::startWith(this.opened);

  // const scrimClick$ = Observable::fromEvent(this[SCRIM], 'click')
  //   ::filterWith(opened$)
  //   ::effect(this::prepInteraction);

  // TODO: rename -- or -- find better solution for "circut breaker"
  const ref = {};

  // TODO: recalculate on change. let user provide width?
  const drawerWidth = this::getMovableDrawerWidth();
  this[SCROLL] = document.querySelector(this.scrollSelector);

  const start$ = this::getStartObservable()
    ::share();

  // As long as the scrim is visible, the user can still "catch" the drawer
  const scrimVisible$ = Observable::defer(() =>
    ref.translateX$::map(translateX => translateX > 0)::startWith(false));

  // Indicates whether the touch positon is within the range (x-axis)
  const inRange$ = start$
    ::withLatestFrom(scrimVisible$)
    ::map(([{ clientX }, scrimVisible]) => scrimVisible || this::isInRange(clientX, drawerWidth))
    ::effect((inRange) => { if (inRange) { this::prepInteraction(); } })
    ::share();

  const end$ = this::getEndObservable()
    ::filterWith(inRange$)
    ::share();

  const move$ = this::getMoveObservable(start$, end$)
    ::filterWith(inRange$)
    ::share();

  const isSliding$ = this::getIsSlidingObservable(move$, start$)
    ::take(1)
    ::startWith(undefined)
    ::repeatWhen(() => end$)
    ::share();
  // const isScrolling$ = isSliding$::map(x => (x === undefined ? undefined : !x));

  // const startedMoving$ = isSliding$
  //   ::map(isSliding => isSliding !== undefined)
  //   ::share();

  ref.translateX$ = Observable::defer(() =>
    Observable::merge(
      move$
        ::filterWith(isSliding$)
        ::effect(({ e }) => { if (this.preventDefault) e.preventDefault(); })
        ::withLatestFrom(start$, ref.startTranslateX$)
        ::map(([{ clientX }, { clientX: startX }, startTranslateX]) =>
          this::calcTranslateX(clientX, startX, startTranslateX, drawerWidth)),
      opened$
        ::startWith(this.opened)
        ::effect(this::cleanupInteraction)
        ::map(opened => (opened ? drawerWidth : 0)),
      ref.anim$))
    ::share();

  ref.startTranslateX$ = ref.translateX$
    ::sample(start$);
    // ::startWith(this.opened ? drawerWidth : 0);

  const velocity$ = ref.translateX$
    ::timestamp()
    ::pairwise()
    ::map(([{ value: x, timestamp: time },
            { value: prevX, timestamp: prevTime }]) =>
      (x - prevX) / (time - prevTime))
    ::startWith(0);

  ref.anim$ = Observable::merge(
      end$
        ::withLatestFrom(ref.translateX$, velocity$)
        ::map(([, translateX, velocity]) =>
          this::calcWillOpen(velocity, translateX, drawerWidth)),
      this[ANIMATE_TO]
        ::effect(this::prepInteraction))

    // TODO: better way to break circut?
    ::effect((willOpen) => { this.setInternalStateKV('opened', willOpen); })
    ::withLatestFrom(ref.translateX$::startWith(this.opened ? drawerWidth : 0))
    ::switchMap(([opened, translateX]) => {
      const endTranslateX = (opened ? 1 : 0) * drawerWidth;
      const diffTranslateX = endTranslateX - translateX;
      return createTween(linearTween, translateX, diffTranslateX, this.transitionDuration)
        ::effect(null, null, () => this::cleanupInteraction(opened))
        ::takeUntil(start$);
    });

  ref.translateX$
    ::effect(translateX => this::updateDOM(translateX, drawerWidth))
    .subscribe();
}

export function drawerMixin(C) {
  return class extends componentMixin(C) {
    static get componentName() {
      return 'y-drawer';
    }

    static get defaults() {
      return {
        opened: false,
        transitionDuration: 250,
        persistent: false,
        scrollSelector: 'body',
        edgeMargin: 0,
        preventDefault: false,
        mouseEvents: false,
      };
    }

    static get sideEffects() {
      return {
        opened(x) { this[OPENED].next(x); },
        persistent(x) { this[PERSISTENT].next(x); },
      };
    }

    // @override
    setupComponent(el, props) {
      super.setupComponent(el, props);

      this::cacheDOMElements();
      this::setupObservables();

      // this.opened = this.opened; // trigger side effect
      // this.jumpTo(this.opened);
      // if (!this.persistent) this.addEventListeners();
      if (this.persistent) this[SCRIM].style.display = 'none';

      this.fireEvent('attached');

      return this;
    }

    open() {
      this[ANIMATE_TO].next(true);
      return this;
    }

    close() {
      this[ANIMATE_TO].next(false);
      return this;
    }

    toggle() {
      if (this.opened) {
        this.close();
      } else {
        this.open();
      }
      return this;
    }

    persist() {
      this.persistent = true;
      return this;
    }

    unpersist() {
      this.persistent = false;
      return this;
    }
  };
}
