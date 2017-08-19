// # mixin/index.js
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

// ## Introduction
// This component is written with RxJS, which you can think of as a DSL for asynchronous events.
// I chose it for a couple of reasons:
// * UI components are essentially a set of rules on how to interpret a series of
//   asynchronous events from different sources.
// * Observables follow naturally from inverting an iterator, which are a staple in
//   modern programming languages, making them somewhat more "basic" than other (UI-) libraries.
//   Ideally, a low-level component shouldn't depend on anything,
//   but since hand-writing async-heavy code is *very* error-prone,
//   observables are is the next best choice.
// * The specific library, RxJS 5, allows to only import the parts that are relevant to you
//   (see below) which helps to keep the size of the componentn down.
//
// The other thing you will notice is the usage of the `::` operator.
// It is a non-stanard ES feature (babel knows how to transpile it), but it helpes dramatically with
// writing custom operators (see `filterWith` and `pauseWith`),
// avoiding monkey-patching the `Observable`'s prototype, and
// it allows eslint to procude warnings when a function is either not imported or unused.
// Additionally, it helps with keeping interal functions private, and
// offers some quality of life improvements, like `::console.log`,
// which binds the `log` function to the `console` object (so it can be passed around).
// As for reading the code, you can simply interpret `::` as `.` in most cases.
//
// * Table of Contents
// {:toc}

// ## Imports
// ES6+ functions that we use.
// TODO: Explain `-lite` version.
import 'core-js/fn/function/bind';
import 'core-js/fn/object/assign';

// TODO: explain `hy-component`
import { componentMixin, setup, fire, setState,
  MODERNIZR_TESTS as COMPONENT_MODERNIZER_TESTS } from 'hy-component/src/component';

// As mentioned before, we only import the RxJS function that we actually need.
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { never } from 'rxjs/observable/never';

import { _do as effect } from 'rxjs/operator/do';
import { delay } from 'rxjs/operator/delay';
import { combineLatest } from 'rxjs/operator/combineLatest';
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

// TODO: explain `MODERNIZR_TESTS`
export const MODERNIZR_TESTS = [
  ...COMPONENT_MODERNIZER_TESTS,
  /* 'touchevents', // optional */
  /* 'pointerevents', // windows (phone) ??? */
  /* 'willchange', // optional */
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
const VELOCITY_THRESHOLD = 0.15;

// By how much (in px) should the finger/mouse need to move,
// before we are confident about making a decision about it's direction?
const SLIDE_THRESHOLD = 10;

// TODO: rename
const MAGIC_MIKE = 0.5;

// If Symbol isn't supported, just use underscore naming convention for private properties.
// We don't need advanced features of Symbol.
// TODO: does rxjs import a Symbol polyfill anyway?
const Symbol = global.Symbol || (x => `_${x}`);

// We use symbols for all internal stuff, because this is a mixin and could
// be used in a variety of contexts, where names may conflict.
// Also, we don't want you to accidentially modify internal state.
const openedObs = Symbol('openedObs');
const alignObs = Symbol('alignObs');
const persistentObs = Symbol('persistentObs');
const preventDefaultObs = Symbol('preventDefaultObs');
const mouseEventsObs = Symbol('mouseEventsObs');
const animateToObs = Symbol('animateToObs');
const backButtonObs = Symbol('backButtonObs');
const drawerWidth = Symbol('drawerWidth');
const scrimEl = Symbol('scrimEl');
const contentEl = Symbol('contentEl');
const scrollEl = Symbol('scrollEl');

// Using shorthands for common functions
const assign = ::Object.assign;
const abs = ::Math.abs;
const min = ::Math.min;
const max = ::Math.max;

// ## Helper Fuctions
// Like `filter`, but takes an observable of booleans instead of a predicate function.
// Similar to `pauseWith`, but will not unsubscribe from the source observable.
function filterWith(p$) {
  if (process.env.DEBUG && !p$) throw Error();
  return this::withLatestFrom(p$)::filter(([, p]) => p)::map(([x]) => x);
}

// Similar to `filterWith`, but will unsubscribe from the source observable,
// when `pauser$` emits `true`, and re-subscribe when `pauser$` emits `false`.
// Note that `true` and `false` have to exact opposite effect here, i.e.
// when paused is true no values will pass through,
// while `filterWith` will let values pass when it's argument is `true`.
function pauseWith(pauser$) {
  if (process.env.DEBUG && !pauser$) throw Error();
  return pauser$::switchMap(paused => (paused ? Observable::never() : this));
}

// Given a x coordinate and the current drawer width,
// determine whether it is within range to initiate an sliding interaction.
function isInRange(clientX, opened) {
  switch (this.align) {
    case 'left':
      return clientX > (this.edgeMargin * (devicePixelRatio || 1))
        && (opened || clientX < this[drawerWidth] * MAGIC_MIKE);
    case 'right':
      return clientX < innerWidth - (this.edgeMargin * (devicePixelRatio || 1))
        && (opened || clientX > innerWidth - (this[drawerWidth] * MAGIC_MIKE));
    default:
      throw Error();
  }
}

// Based on current velocity and position of the drawer, will the drawer slide open, or snap back?
// TODO: could incorporate the current open state of the drawer
function calcWillOpen(velocity, translateX) {
  switch (this.align) {
    case 'left': {
      if (velocity > VELOCITY_THRESHOLD) return true;
      else if (velocity < -VELOCITY_THRESHOLD) return false;
      else if (translateX >= this[drawerWidth] / 2) return true;
      else return false;
    }
    case 'right': {
      if (-velocity > VELOCITY_THRESHOLD) return true;
      else if (-velocity < -VELOCITY_THRESHOLD) return false;
      else if (translateX <= -this[drawerWidth] / 2) return true;
      else return false;
    }
    default:
      throw Error();
  }
}

// Calcuate the current position of the drawer,
// by taking the difference between the current position and starting postion of the finger,
// then adding that difference to the starting position of the drawer.
// This way, we avoid the drawer "jumping" to the finger, when catching it during an animtion.
// It will also clip the position at 0 and the width of the drawer.
function calcTranslateX(clientX, startX, startTranslateX) {
  switch (this.align) {
    case 'left': {
      const deltaX = clientX - startX;
      const translateX = startTranslateX + deltaX;
      return max(0, min(this[drawerWidth], translateX));
    }
    case 'right': {
      const deltaX = clientX - startX;
      const translateX = startTranslateX + deltaX;
      return min(0, max(-this[drawerWidth], translateX));
    }
    default:
      throw Error();
  }
}

// Since part of the drawer could be visible,
// the width that is "movable" is less than the complete drawer width and given by
function getMovableDrawerWidth() {
  /* TODO: subtract "peek over edge" */
  return this[contentEl].clientWidth;
}

// Side effects happening before a user interaction.
// Note that the drawer receives the `y-drawer-opened` CSS class when it is opend.
// The opened class makes the drawer appear open, not by setting `translateX` (which depends
// on the drawer's size), but by setting the CSS `left`/`right` property.
// That way, the drawer's width can change while it is open without breaking the layout (and without
// having the recalculate `translateX` on every `resize` event).
// However, it has to be removed before we move the drawer via `translateX` again.
function prepareInteraction() {
  this[contentEl].style.willChange = 'transform';
  this[scrimEl].style.willChange = 'opacity';
  this[contentEl].classList.remove('hy-drawer-opened');
  this[drawerWidth] = this::getMovableDrawerWidth();
}

// Cleanup code after a completed interaction.
function cleanupInteraction(opened) {
  this[contentEl].style.willChange = '';
  this[scrimEl].style.willChange = '';

  if (opened) {
    this[scrimEl].style.pointerEvents = 'all';
    if (this[scrollEl]) this[scrollEl].style.overflowY = 'hidden';
    this[contentEl].classList.add('hy-drawer-opened');
  } else {
    this[scrimEl].style.pointerEvents = '';
    if (this[scrollEl]) this[scrollEl].style.overflowY = ''; // TODO: allow scrolling earlier
    this[contentEl].classList.remove('hy-drawer-opened');
  }

  if (this.backButton) {
    const hash = `#${this.el.id}--opened`;
    if (opened
        && location.hash !== hash) {
      history.pushState({ id: this.el.id }, document.title, hash);
    }
    if (!opened
        && (history.state && history.state.id === this.el.id)
        && location.hash !== '') {
      history.back();
    }
  }

  this[fire]('transitioned', opened);
}

// The end result of pretty much everything in this component is
// to modify the `transform` of the content, and the `opacity` of the scrim.
function updateDOM(translateX) {
  const inv = this.align === 'left' ? 1 : -1;
  this[contentEl].style.transform = `translateX(${translateX}px)`;
  this[scrimEl].style.opacity = (translateX / this[drawerWidth]) * inv;
}

// ### Start Observable
function getStartObservable() {
  // When you change the `mouseEvents` or `preventDefault` option,
  // we re-subscribe to reflect the changes.
  /* TODO: this causes the code to run twice on startup */
  return Observable::merge(this[mouseEventsObs], this[preventDefaultObs])::switchMap(() => {
    const touchstart$ = Observable::fromEvent(document, 'touchstart', {
      passive: !this.preventDefault,
    })
      ::filter(({ touches }) => touches.length === 1)
      ::map(({ touches }) => touches[0]);

    // If mouse events aren't enabled, we're done here.
    if (!this.mouseEvents) return touchstart$;

    // Otherwise we also include `mousedown` events in the output.
    const mousedown$ = Observable::fromEvent(document, 'mousedown', {
      passive: !this.preventDefault,
    });

    return touchstart$::mergeWith(mousedown$);
  });
}

// ### Move Observable
function getMoveObservable(start$, end$) {
  // When you change the `mouseEvents` or `preventDefault` option,
  // we re-subscribe to reflect the changes.
  /* TODO: this causes the code to run twice on startup */
  return Observable::merge(this[mouseEventsObs], this[preventDefaultObs])::switchMap(() => {
    const touchmove$ = Observable::fromEvent(document, 'touchmove', {
      passive: !this.preventDefault,
    })
      // We're only keeping track of  the first finger.
      // Should the user remove the finger that started the interaction, we use the next instead.
      // Note that this doesn't occur under normal cirumstances,
      // and exists primarliy to ensure that the interaction continues without hiccups.
      // We also store `preventDefault` (bound to the event), in case we need it to call it later.
      ::map(e => assign(e.touches[0], { preventDefault: ::e.preventDefault }));

    // If mouse events aren't enabled, we're done here.
    if (!this.mouseEvents) return touchmove$;

    const mousemove$ = Observable::fromEvent(document, 'mousemove', {
      passive: !this.preventDefault,
    })
      // Unlike touch events, `mousemove` events occur without a prior start event.
      // Since're only interested in move events when the mouse is down,
      // we unsubscribe when the mouse goes up, and re-subscribe when it goes down.
      ::pauseWith(Observable::merge(start$::mapTo(false), end$::mapTo(true)))
      ::map(e => assign(e, { preventDefault: ::e.preventDefault }));

    return touchmove$::mergeWith(mousemove$);
  });
}

// ### End Observable
function getEndObservable() {
  // When you change the `mouseEvents` or `preventDefault` option,
  // we re-subscribe to reflect the changes.
  /* TODO: this causes the code to run twice on startup */
  return Observable::merge(this[mouseEventsObs], this[preventDefaultObs])::switchMap(() => {
    const touchend$ = Observable::fromEvent(document, 'touchend', {
      passive: !this.preventDefault,
    })
      // We're only interested in the last `touchend`.
      // Otherwise there's at least one finger left on the screen,
      // that can be used to slide the drawer.
      ::filter(({ touches }) => touches.length === 0);

    // If mouse events aren't enabled, we're done here.
    if (!this.mouseEvents) return touchend$;

    const mouseup$ = Observable::fromEvent(document, 'mouseup', {
      passive: !this.preventDefault,
    });

    return touchend$::mergeWith(mouseup$);
  });
}

// ### Sliding or scrolling?
function getIsSlidingObservable(move$, start$) {
  // Before we make a decision about whether the user is
  // sliding the drawer or scrolling the content, we wait for the finger/mouse to travel
  // at least `SLIDE_THRESHOLD` pixels.
  /* TODO: Should the way we detect sliding depend on `preventDefault`? */
  if (!this.preventDefault) {
    return move$::withLatestFrom(start$)
      ::skipWhile(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startY - clientY) < SLIDE_THRESHOLD && abs(startX - clientX) < SLIDE_THRESHOLD)
      ::map(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startX - clientX) >= abs(startY - clientY));
  // The Logic needs to be slightly different when using `preventDefault`.
  // iOS Safari will ignore all calls to `preventDefault`,
  // except the one on the first move event, so we have to make a decision immediately.
  // Luckily, Safari will not fire a move event until the finger has travelled a minium distance.
  } else {
    return move$::withLatestFrom(start$)
      ::map(([{ clientX, clientY, preventDefault }, { clientX: startX, clientY: startY }]) => {
        const isSliding = abs(startX - clientX) >= abs(startY - clientY);
        if (this.preventDefault && isSliding) preventDefault();
        return isSliding;
      });
  }
}

// ## Putting it together
// This is the main function, putting together all the parts.
function setupObservables() {
  // Emitts a value every time you change the `persistent` property of the drawer.
  const persistent$ = this[persistentObs]::share();

  // We use this to get references to observables that get defined alter.
  const ref = {};

  // The current width of the drawer.
  // Will be recalculated at the beginning of every interaction.
  // It is assumed that it doesn't change while the user is sliding the drawer.
  this[drawerWidth] = this::getMovableDrawerWidth();

  // Emits a value every time a `touchstart` (or `mousedown`) *could* intiate an interaction.
  // Each emitted value is a hash containing a `clientX` and `clientY` key.
  const start$ = this::getStartObservable()
    ::pauseWith(persistent$)
    ::share();

  // An observable that emits `true`, as long as the drawer isn't fully closed.
  // As long as the scrim is visible, the user can still "catch" the drawer.
  const isScrimVisible$ = Observable::defer(() =>
      ref.translateX$::map(translateX => (this.align === 'left' ?
        translateX > 0 :
        translateX < this[drawerWidth])));
  /* no share because used only once */

  // An observable that emits `true`, as long as the drawer isn't fully extended.
  // We call it animating when the drawer isn't fully extended, i.e. in some intermediate position.
  // Since we use this to to close the drawer (see below), we don't care about the closed state
  // (the other state where drawer isn't animating is when `translateX` is 0).
  const isAnimating$ = Observable::defer(() =>
      ref.translateX$::map(translateX => (this.align === 'left' ?
        translateX < this[drawerWidth] :
        translateX > 0)));
  /* no share because used only once */

  // If the first touch occured outside the range from which to pull the drawer,
  // this observable will emit a `false` value.
  // This ensusred that the drawer can only be pulled form a narrow range close to the edge.
  const isInRange$ = start$
    ::withLatestFrom(isScrimVisible$)
    ::map(([{ clientX }, isScrimVisible]) => this::isInRange(clientX, isScrimVisible))
    ::effect((inRange) => { if (inRange) this::prepareInteraction(); })
    ::share();

  // The observable of all relevant "end" events, i.e. the last `touchend`
  // as well as `mouseup` when mosue events are enabled.
  const end$ = this::getEndObservable()
    // Unsubscribe when `persistent` is true:
    ::pauseWith(persistent$)
    // We are only interested in the event if the event that started this interaction,
    // occured within the range from where the drawer can be pulled.
    // Must not unsubscribe (b/c of how `preventDefault` in Safari works):
    ::filterWith(isInRange$)
    ::share();

  // The observable of all relevant "move" events.
  // Each emitted value has a `clientX`, `clientY` and `preventDefault` (function) key.
  const move$ = this::getMoveObservable(start$, end$)
    // Unsubscribe when `persistent` is true:
    ::pauseWith(persistent$)
    // We are only interested in the event if the event that started this interaction,
    // occured within the range from where the drawer can be pulled.
    // Must not unsubscribe (b/c of how `preventDefault` in Safari works):
    ::filterWith(isInRange$)
    ::share();

  // For every interaction, determine whether it is a sliding (y-axis),
  // or scrolling (x-axis) motion.
  // The value is `undefind` until we are ready to make a decision (see `getIsSlidingObservable`),
  // then it remains `true` or `false` for the remainder of the interaction,
  // and is `undefined` again once `end$` emits a value (the end of the interaction).
  const isSliding$ = this::getIsSlidingObservable(move$, start$)
    ::effect((isSliding) => {
      if (this[scrollEl] && isSliding) this[scrollEl].style.overflowY = 'hidden';
    })
    ::take(1)
    ::startWith(undefined)
    ::repeatWhen(() => end$);

  // This is the central observable of this component.
  // It is the current x coordinate of the drawer, which
  // can be modified by either of 3 incomming observables:
  // 1. The move observable (the user's finger/mouse moving across the screen)
  // 2. The animation/tween observable (the drawer moving (back) into a valid position)
  // 3. The observables that emits a value when the `opened` state was modified directly.
  //
  // It is wrapped in a `defer` because it depends on previous values of itself.
  ref.translateX$ = Observable::defer(() => Observable::merge(
      // 1) We only let move events modify the drawer's position when we are sure
      // that the user is sliding:
      move$
        ::filterWith(isSliding$)
        ::effect(({ preventDefault }) => { if (this.preventDefault) preventDefault(); })
        ::withLatestFrom(start$, ref.startTranslateX$)
        ::map(([{ clientX }, { clientX: startX }, startTranslateX]) =>
          this::calcTranslateX(clientX, startX, startTranslateX)),

      // 2) The tween observable can be used unmodified (see below),
      // but isn't defined yet, because it depends on previous values of this observable.
      ref.tween$,

      // 3) When the `opened` state changes, we "jump" to the new position,
      // which is either 0 (when closed) or the width of the drawer (when open).
      this[openedObs]::combineLatest(this[alignObs])
        /* TODO: drawerWdith could be outdated */
        ::map(([opened, align]) => (!opened ? 0 : this[drawerWidth] * (align === 'left' ? 1 : -1)))
        // Only in this case we need to call the cleanup code directly,
        // which would otherwise run at the end of an animation:
        ::effect(this::cleanupInteraction)))
    ::share();

  // The `translateX` value at the start of an interaction.
  // Typically, this would be either 0 or `drawerWidth`, but since the user can initiate
  // an interaction *during an animation*, it can also be every value inbetween.
  ref.startTranslateX$ = ref.translateX$::sample(start$);

  // The current velocity of the slider.
  const velocity$ = ref.translateX$
    ::timestamp()
    ::pairwise()
    ::map(([{ value: x, timestamp: time },
            { value: prevX, timestamp: prevTime }]) =>
      (x - prevX) / (time - prevTime))
    ::startWith(0);

  // There are 2 thigns that can trigger an animation:
  // 1. The end of an interaction, i.e. the user releases the finger/mouse while moving the slider.
  // 2. A call to a method like `open` or `close` (represented by a value on the
  //    animate-to observable)
  ref.tween$ = Observable::merge(
      // 1) When the user releases the finger/mouse, we take the current velocity of the drawer and
      // calculate whether it should open or close.
      end$
        ::withLatestFrom(ref.translateX$, velocity$)
        ::map(([, translateX, velocity]) => this::calcWillOpen(velocity, translateX)),

      // 2) In this case we need to call the prepare code directly,
      // which would have been called at the beginning of the interaction otherwise.
      this[animateToObs]
        ::effect(this::prepareInteraction)
        // Give the browser some time to prepare the animation (`will-change`).
        // Note that less than 100ms response time are not noticiable.
        ::delay(50))

    // We silently set the new `opened` state here,
    // so that the next interaction will do the right thing,
    // even while the animation is still playing.
    // E.g. a call to `toggle` will cancel the current animation and initiate an animation
    // to the correct opposite state.
    ::effect(willOpen => this[setState]('opened', willOpen))
    // This ensures that subsequent events that trigger an animation
    // don't cause more than one animation to be played at a time.
    ::withLatestFrom(ref.translateX$)
    ::switchMap(([opened, translateX]) => {
      const endTranslateX = (opened ? 1 : 0) * this[drawerWidth] * (this.align === 'left' ? 1 : -1);
      const diffTranslateX = endTranslateX - translateX;
      // A tween based on the values we've just computed,
      // that runs cleanup code when it completes --- unless a new interactions in initiated,
      // in which case it is canceled.
      return createTween(linearTween, translateX, diffTranslateX, TRANSITION_DURATION)
        ::effect(null, null, () => this[openedObs].next(opened))
        ::takeUntil(start$)
        ::takeUntil(this[alignObs]);
    });

  // The end result is always to update the (shadow) DOM, which happens here.
  // Note that the call to subscribe sets the whole process in motion,
  // and causes the code inside the above `defer` observables to run.
  ref.translateX$
    .subscribe(translateX => this::updateDOM(translateX));

  // A click on the scrim should close the drawer, but only when the drawer is fully extended.
  // Otherwise it's possible to accidentially close the drawer during sliding/animating.
  /* TODO: this still happens with mouseevents */
  Observable::fromEvent(this[scrimEl], 'click')
    ::pauseWith(isAnimating$)
    .subscribe(() => this.close());

  // Other than preventing sliding, setting `persistent` will also hide the scrim.
  persistent$.subscribe((persistent) => {
    this[scrimEl].style.display = persistent ? 'none' : 'block';
  });

  // TODO
  Observable::fromEvent(window, 'popstate')
    ::pauseWith(this[backButtonObs]::map(x => !x))
    .subscribe((e) => {
      if (e.preventDefault) e.preventDefault();

      const hash = `#${this.el.id}--opened`;
      const willOpen = location.hash === hash;
      if (willOpen !== this.opened) this[animateToObs].next(willOpen);
    });

  // TODO
  this[alignObs]
    .subscribe((align) => {
      const oldAlign = align === 'left' ? 'right' : 'left';
      this[contentEl].classList.remove(`hy-drawer-${oldAlign}`);
      this[contentEl].classList.add(`hy-drawer-${align}`);
    });
}

// ## The final export
export function drawerMixin(C) {
  return class extends componentMixin(C) {

    // TODO
    static get componentName() { return 'hy-drawer'; }

    // TODO
    static get defaults() {
      return {
        opened: false,
        align: 'left',
        persistent: false,
        scrollSelector: 'body',
        edgeMargin: 0,
        preventDefault: false,
        mouseEvents: false,
        backButton: false,
      };
    }

    // TODO
    static get sideEffects() {
      return {
        opened(x) { this[openedObs].next(x); },
        align(x) { this[alignObs].next(x); },
        persistent(x) { this[persistentObs].next(x); },
        preventDefault(x) { this[preventDefaultObs].next(x); },
        mouseEvents(x) { this[mouseEventsObs].next(x); },
        backButton(x) { this[backButtonObs].next(x); },
        scrollSelector(scrollSelector) {
          this[scrollEl] = document.querySelector(scrollSelector);
        },
      };
    }

    /* @override */
    [setup](el, props) {
      super[setup](el, props);

      if (process.env.DEBUG && this.backButton && !this.el.id) {
        console.warn('hy-drawer needs to haven an id attribute in order for the backButton option to work.');
      }

      // Observables used for side effects caused by changing properties on the component.
      // The are used to emit the new vale whenever properties get changed on the component.
      this[openedObs] = new Subject();
      this[alignObs] = new Subject();
      this[persistentObs] = new Subject();
      this[preventDefaultObs] = new Subject();
      this[mouseEventsObs] = new Subject();
      this[backButtonObs] = new Subject();
      this[animateToObs] = new Subject();

      // Cache DOM elements.
      this[scrimEl] = this.root.querySelector('.hy-drawer-scrim');
      this[contentEl] = this.root.querySelector('.hy-drawer-content');
      // if (this.scrollSelector) this[scrollEl] = document.querySelector(this.scrollSelector);

      // Set the alignment class.
      /* TODO: respond to changes */
      this[contentEl].classList.add(`hy-drawer-${this.align}`);

      // This is where most of the action happens.
      this::setupObservables();

      // Now we set the initial opend state.
      // Note that the opened state in the URL takes precedence over the initialization value.
      const hash = `#${this.el.id}--opened`;
      const willOpen = location.hash === '' ? undefined : location.hash === hash;
      if (willOpen !== undefined) this[setState]('opened', willOpen);
      this[openedObs].next(this.opened);

      // Putting the initial values on the side-effect--observables:
      this[alignObs].next(this.align);
      this[persistentObs].next(this.persistent);
      this[preventDefaultObs].next(this.preventDefault);
      this[mouseEventsObs].next(this.mouseEvents);
      this[backButtonObs].next(this.backButton);

      // Firing an event to let the outside world know the drawer is ready.
      this[fire]('attached');

      // Allow function chaining.
      return this;
    }

    // TODO
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
