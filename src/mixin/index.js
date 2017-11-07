// # src / mixin / index.js
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

// ## Overview
// This component is written in [RxJS] and reading its code requires some basic understanding
// of how RxJS works. It may also serve as an example of how to use RxJS (or how not to use it...).
//
// Other than RxJS, you should be familiar with the (non-standard) function-bind syntax `::`,
// which is extremely helpful with using RxJS operators *as if* they were class methods,
// as well as writing private functions for our mixin.
//
// Finally, the export is a [ES6 Mixin][esmixins],
// which is a clever way of using the ES6 class syntax to achieve inheritance-based mixins.
//
// ## Table of Contents
// {:.no_toc}
// * Table of Contents
// {:toc}

// ## Imports
// ES6+ functions that we use.
import 'core-js/fn/array/from';
import 'core-js/fn/function/bind';
import 'core-js/fn/object/assign';

// Importing the hy-compontent base libary,
// which helps with making multiple versions of the component (Vanilla JS, WebComponent, etc...).
import { componentMixin, COMPONENT_FEATURE_TESTS } from 'hy-component/src/component';
import { sSetup, sSetupDOM, sFire, sSetState } from 'hy-component/src/symbols';
import { arrayOf, bool, number, string, oneOf } from 'hy-component/src/types';

// As mentioned before, we only import the RxJS function that we need.
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { never } from 'rxjs/observable/never';

import { _do as tap } from 'rxjs/operator/do';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { mapTo } from 'rxjs/operator/mapTo';
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

// Some helper functions to create observable tweens. See [src / common.js](../common.md).
import { createTween, linearTween, Set } from '../common';

// ## Constants
// A set of [Modernizr] tests that are required for this component to work.
export const MIXIN_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
  'eventlistener',
  'queryselector',
  'requestanimationframe',
  'classlist',
  'opacity',
  'csstransforms',
  'csspointerevents',
]);

// We export the setup symbols,
// so that mixin users don't have to import them from hy-compnent separately.
export { sSetup, sSetupDOM };

// The duration (in ms) of the animation when releasing the drawer.
const TRANSITION_DURATION = 200;

// Minimum velocity of the drawer (in px/ms) when releasing to make it fling to opened/closed state.
const VELOCITY_THRESHOLD = 0.15;

// If `Symbol` isn't supported, just use underscore naming convention for private properties.
const Symbol = global.Symbol || (x => `_${x}`);

// We use `Symbol`s for all internal variables, to avoid naming conflicts when using the mixin.
// Instead of using UPPERCASE names for symbols, which makes the code too verbose,
// we prefix every symbol with the letter 's'.
const sOpened$ = Symbol('openedObservable');
const sAlign$ = Symbol('alignObservable');
const sPersitent$ = Symbol('persistentObservable');
const sPreventDefault$ = Symbol('preventDefaultObservable');
const sMouseEvents$ = Symbol('mouseEventsObservable');
const sBackButton$ = Symbol('backButtonObservable');
const sAnimateTo$ = Symbol('animateToObservable');
const sDrawerWidth = Symbol('drawerWidth');
const sScrimEl = Symbol('scrimElement');
const sContentEl = Symbol('contentElement');
const sScrollEl = Symbol('scrollElement');

// Using shorthands for common functions
const assign = ::Object.assign;
const abs = ::Math.abs;
const min = ::Math.min;
const max = ::Math.max;

// ## Fuctions
// ### Observable extensions
// #### Filter when
// This operator is like `filter`, but it takes an observable of booleans as input,
// instead of a predicate function.
function filterWhen(p$, ...others) {
  if (process.env.DEBUG && !p$) throw Error();
  else if (others.length === 0) {
    return this::withLatestFrom(p$)::filter(([, p]) => p)::map(([x]) => x);

  // When providing more than one observable, the result observable will only emit values
  // when `every` input observable has emitted a truthy value.
  } else {
    return this::withLatestFrom(p$, ...others)
      ::filter(([, ...ps]) => ps.every(p => p))
      ::map(([x]) => x);
  }
}

// #### Subscribe when
// This operator is like `filterWhen`, but it will unsubscribe from the source observable
// when the input observable emits `false`, and re-subscribe when it emits `true`.
function subscribeWhen(p$) {
  if (process.env.DEBUG && !p$) throw Error();
  return p$::switchMap(p => (p ? this : Observable::never()));
}

// ### Private Methods
// The functions are used as "private" methods on the mixin, using the `::` syntax.

// #### Is in range?
// Given a x-coordinate, `isInRange` will  determine whether it is within range from where
// to pull the drawer. The x-coordinate *must* be larger than the lower bound,
// but when the drawer is opened it may be anywhere on the screen.
// Otherwise it must be below the upper bound.
function isInRange(clientX, opened) {
  switch (this.align) {
    case 'left':
      return clientX > this.range[0]
        && (opened || clientX < this.range[1]);
    case 'right':
      return clientX < window.innerWidth - this.range[0]
        && (opened || clientX > window.innerWidth - this.range[1]);
    default:
      throw Error();
  }
}

// #### Calculate 'Will open?'
// Based on current velocity and position of the drawer,
// should the drawer slide open, or snap back?
// TODO: could incorporate the current open state of the drawer.
function calcWillOpen(velocity, translateX) {
  switch (this.align) {
    case 'left': {
      if (velocity > VELOCITY_THRESHOLD) return true;
      else if (velocity < -VELOCITY_THRESHOLD) return false;
      else if (translateX >= this[sDrawerWidth] / 2) return true;
      else return false;
    }
    case 'right': {
      if (-velocity > VELOCITY_THRESHOLD) return true;
      else if (-velocity < -VELOCITY_THRESHOLD) return false;
      else if (translateX <= -this[sDrawerWidth] / 2) return true;
      else return false;
    }
    default:
      throw Error();
  }
}

// #### Calculate translate X
// Calcuate the current position of the drawer,
// by taking the difference between the current and starting postion of the finger,
// then adding that difference to the starting position of the drawer.
// This way, we avoid the drawer jumping to the finger, when "catching" it during an animation.
// The function will also clip the position at 0 and the width of the drawer.
function calcTranslateX(clientX, startX, startTranslateX) {
  switch (this.align) {
    case 'left': {
      const deltaX = clientX - startX;
      const translateX = startTranslateX + deltaX;
      return max(0, min(this[sDrawerWidth], translateX));
    }
    case 'right': {
      const deltaX = clientX - startX;
      const translateX = startTranslateX + deltaX;
      return min(0, max(-this[sDrawerWidth], translateX));
    }
    default:
      throw Error();
  }
}

// #### Get movable drawer width
// One feature of hy-drawer is to allow the drawer to "peek" over the edge.
// This effect is achieved by setting a smaller negative `left` (`right`) CSS property,
// than is the width of the drawer,
// The 'moveable' part of the drawer, then, is equal to that the inverse of that property.
// See [Styling](../../styling.md) for more.
function getMovableDrawerWidth() {
  return -parseFloat(getComputedStyle(this[sContentEl])[this.align]);
}

// #### Prepare and cleanup interaction
// `prepareInteraction` causes various side effects before sliding the drawer.
//
// Note that the drawer receives the `hy-drawer-opened` CSS class when it is opened.
// This class makes the drawer appear open by setting the CSS `left` (`right`) property, instead
// of an absoulte `transform` value.
// This way, the drawer's width can change while it is open without having to
// recalculate `translateX` on every `resize`.
// However, it has to be removed before we move the drawer via `translateX` again.
function prepareInteraction() {
  this[sContentEl].style.willChange = 'transform';
  this[sScrimEl].style.willChange = 'opacity';
  this[sContentEl].classList.remove('hy-drawer-opened');
}

function histId() {
  return this.el.id || this.constructor.componentName;
}

// Cleanup code after a completed interaction.
// Will add/remove the beforementioned `hy-drawer-opened` class.
function cleanupInteraction(opened) {
  this[sScrimEl].style.willChange = '';
  this[sContentEl].style.willChange = '';

  if (opened) {
    this[sScrimEl].style.pointerEvents = 'all';
    this[sContentEl].classList.add('hy-drawer-opened');
  } else {
    this[sScrimEl].style.pointerEvents = '';
    this[sContentEl].classList.remove('hy-drawer-opened');
  }

  // If the experimental back button feature is enabled we hack the history API,
  // so that it matches the state of the drawer...
  if (this._backButton) {
    const id = this::histId();
    const hash = `#${id}--opened`;

    if (opened && window.location.hash !== hash) {
      window.history.pushState({ [id]: true }, document.title, hash);
    }

    if (!opened
        && (window.history.state && window.history.state[this::histId()])
        && window.location.hash !== '') {
      window.history.back();
    }
  }

  // Once we're finished cleaning up, we fire the `transitioned` event.
  this[sFire]('transitioned', { detail: opened });
}

// #### Update DOM
// In the end, we only modify two properties: The x-coordinate of the drawer,
// and the opacity of the scrim, which is handled by `updateDOM`.
function updateDOM(translateX) {
  const inv = this.align === 'left' ? 1 : -1;
  this[sContentEl].style.transform = `translateX(${translateX}px)`;
  this[sScrimEl].style.opacity = (translateX / this[sDrawerWidth]) * inv;
}

// #### Get start observable
// The following function returns an observable of all "start" events.
// Usually, that's just `touchstart` event of the first finger touching the screen,
// however since the compontent also supports mouse events,
// we may listen for `mousedown` events.
function getStartObservable() {
  // Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.
  return this[sMouseEvents$]::switchMap((mouseEvents) => {
    // The touchstart observable is passive since we won't be calling `preventDefault`.
    // Also, we're only interested in the first `touchstart`.
    const touchstart$ = Observable::fromEvent(document, 'touchstart', { passive: true })
      ::filter(({ touches }) => touches.length === 1)
      ::map(({ touches }) => touches[0]);

    // If mouse events aren't enabled, we're done here.
    if (!mouseEvents) return touchstart$;

    // Otherwise we also include `mousedown` events in the output.
    const mousedown$ = Observable::fromEvent(document, 'mousedown', { passive: true });
    return Observable::merge(touchstart$, mousedown$);
  });
}

// #### Get move observable
// This function returns an observable of all move events. Usually that's just `touchmove`,
// but may also include `mousemove` events while the mouse button is down.
function getMoveObservable(start$, end$) {
  // Since the `mouseEvents` or `preventDefault` option may change at any point,
  // we `switchMap` to reflect the changes.
  // Nice: `combineLatest` provides us with the functionality of emitting
  // when either of the inputs change, but not before all inputs have their first value set.
  return Observable::combineLatest(this[sMouseEvents$], this[sPreventDefault$])
    ::switchMap(([mouseEvents, preventDefault]) => {
      // We're only keeping track of the first finger.
      // Should the user remove the finger that started the interaction, we use the next instead.
      // Note that this doesn't occur under normal circumstances,
      // and exists primarliy to ensure that the interaction continues without hiccups.
      // Note that the event listener is only passive when the `preventDefault` option is falsy.
      const touchmove$ = Observable::fromEvent(document, 'touchmove', {
        passive: !preventDefault,
      })
        ::map(event => assign(event.touches[0], { event }));

      // If mouse events aren't enabled, we're done here.
      if (!mouseEvents) return touchmove$;

      // Otherwise we listen for `mousemove` events,
      // but only those between a `start` and `end` event, i.e. while the user is sliding.
      // We unsubscribe form the source observable outside of those contraints.
      // Again, the listener is only marked as passive when the `preventDefault` option is falsy.
      const mousemove$ = Observable::fromEvent(document, 'mousemove', {
        passive: !preventDefault,
      })
        ::subscribeWhen(Observable::merge(start$::mapTo(true), end$::mapTo(false)))
        ::map(event => assign(event, { event }));

      return Observable::merge(touchmove$, mousemove$);
    });
}

// #### Get end observable
// This function returns an observable of end events.
// Usually, this is the `touchend` event of the last finger, but may also include `mouseup` events,
// when the `mouseEvents` option is enabled.
function getEndObservable() {
  // Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.
  return this[sMouseEvents$]::switchMap((mouseEvents) => {
    // We're only interested in the last `touchend`.
    // Otherwise there's at least one finger left on the screen,
    // that can be used to slide the drawer.
    const touchend$ = Observable::fromEvent(document, 'touchend', { passive: true })
      ::filter(({ touches }) => touches.length === 0);

    // If mouse events aren't enabled, we're done here.
    if (!mouseEvents) return touchend$;

    // Otherwise we include `mouseup` events.
    const mouseup$ = Observable::fromEvent(document, 'mouseup', { passive: true });
    return Observable::merge(touchend$, mouseup$);
  });
}

// #### Get "Is sliding?" observable
// An observable that emits `true` when the user is *sliding* the drawer,
// (i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
// (i.e. moving the finger along the y-axis).
function getIsSlidingObservable(move$, start$) {
  // If the threshold options is set, we delay the decision until
  // the finger has moved at least `threshold` pixels in either direction.
  if (this.threshold) {
    return move$::withLatestFrom(start$)
      ::skipWhile(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startY - clientY) < this.threshold && abs(startX - clientX) < this.threshold)
      ::map(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startX - clientX) >= abs(startY - clientY));

  // If the threshold option is set to `0` (or `false`) we make a decision immediately.
  // This is intended for Safari and possibly other browsers that have a built-in threshold.
  // Additionally, Safari ignores all calls to `preventDefault`, except on the first move event
  // after a start event, so that we *have to* make a decision immediately.
  } else {
    return move$::withLatestFrom(start$)
      ::map(([{ clientX, clientY, event }, { clientX: startX, clientY: startY }]) => {
        const isSliding = abs(startX - clientX) >= abs(startY - clientY);
        if (this.preventDefault && isSliding) event.preventDefault();
        return isSliding;
      });
  }
}

// ### Setup observables
// This function sets up the observable "pipeline".
function setupObservables() {
  // Observables used for side effects caused by changing settings on the component.
  // The are used to emit the new vale whenever properties get changed on the component.
  this[sOpened$] = new Subject();
  this[sAlign$] = new Subject();
  this[sPersitent$] = new Subject();
  this[sPreventDefault$] = new Subject();
  this[sMouseEvents$] = new Subject();
  this[sBackButton$] = new Subject();
  this[sAnimateTo$] = new Subject();

  // Emitts a value every time you change the `persistent` property of the drawer.
  // Interally, we invert it and call it `active`.
  const active$ = this[sPersitent$]::map(x => !x)::share();

  // We use this to get references to observables that aren't defined yet.
  const ref = {};

  // #### Start observable
  // Emits a value every time a start event *could* intiate an interaction.
  // Each emitted value is a hash containing a `clientX` and `clientY` key.
  const start$ = this::getStartObservable()
    ::filterWhen(active$)
    ::share();

  // An observable that emits `true`, as long as the drawer isn't fully closed
  // (as long as the scrim is visible the user can still "catch" the drawer).
  // It references the yet-to-be-defined `translateX` obsevable, so we wrap it inside a `defer`.
  const isScrimVisible$ = Observable::defer(() =>
      ref.translateX$::map(translateX => (this.align === 'left' ?
        translateX > 0 :
        translateX < this[sDrawerWidth])));

  // TODO: ...
  const isInRange$ = start$
    ::withLatestFrom(isScrimVisible$)
    ::map(([{ clientX }, isScrimVisible]) => this::isInRange(clientX, isScrimVisible))
    ::tap((inRange) => { if (inRange) this::prepareInteraction(); })
    ::share();

  // #### End observable
  // The observable of all relevant "end" events, i.e. the last `touchend` (or `mouseup`),
  const end$ = this::getEndObservable()
    ::filterWhen(active$, isInRange$)
    ::share();

  // #### Move observable
  // The observable of all relevant "move" events.
  const move$ = this::getMoveObservable(start$, end$)
    ::filterWhen(active$, isInRange$)
    ::share();

  // #### 'Is sliding?' observable
  // The value is `undefind` until we are ready to make a decision
  // An observable that emits `true` when the user is *sliding* the drawer,
  // (i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
  // (i.e. moving the finger along the y-axis), and `undefined` while we aren't sure yet.
  //
  // (see [`getIsSlidingObservable`](#get-is-sliding-observable)),
  // then it remains `true`/`false` for the remainder of the interaction,
  // and is `undefined` again once the interaction `end`s.
  const isSliding$ = this::getIsSlidingObservable(move$, start$)
    ::take(1)
    ::startWith(undefined)
    ::repeatWhen(() => end$)

    // When the user is sliding, fire the `slidestart` event.
    // Experimental: Set `overflow: hidden` on some container element.
    ::tap((isSliding) => {
      if (isSliding) {
        if (this[sScrollEl]) this[sScrollEl].style.overflow = 'hidden';
        this[sFire]('slidestart', { detail: this.opened });
      }
    });

  // #### Translate X observable
  // The `translateX` observable is the central observable of this component.
  // It emits the current x-coordinate of the drawer, which
  // can be modified by either of 3 incoming observables:
  //
  // 1. The move observable (the user's finger/mouse moving across the screen),
  // 2. the animation/tween observable, and
  // 3. direct modifications of the `opened` state.
  //
  // It is wrapped in a `defer` because it depends on previous values of itself.
  ref.translateX$ = Observable::defer(() => Observable::merge(
      // 1)
      // We only let move events modify the drawer's position when we are sure
      // that the user is sliding. In case the `preventDefault` option is enabled,
      // this is also when we're sure to call `preventDefault`.
      move$::filterWhen(isSliding$)
        ::tap(({ event }) => { if (this.preventDefault) event.preventDefault(); })

        // Finally, we take the start position of the finger, the start position of the drawer,
        // and the current position of the finger to calculate the next `translateX` value.
        ::withLatestFrom(start$, ref.startTranslateX$)
        ::map(([{ clientX }, { clientX: startX }, startTranslateX]) =>
          this::calcTranslateX(clientX, startX, startTranslateX)),

      // 2)
      // The tween observable can be used unmodified (see below),
      // but isn't defined yet, because it depends on previous values of `translateX$`.
      ref.tween$,

      // 3)
      // When the `opened` state changes, we "jump" to the new position,
      // which is either 0 (when closed) or the width of the drawer (when open).
      // We also want to jump when `align` chagnes, in this case to the other side of the viewport.
      Observable::combineLatest(this[sOpened$], this[sAlign$])
        // Usually the cleanup code would run at the end of the fling animation,
        // but since there is no animation in this case, we call it directly.
        ::tap(([opened]) => this::cleanupInteraction(opened))
        ::map(([opened, align]) =>
          (!opened ? 0 : this[sDrawerWidth] * (align === 'left' ? 1 : -1))),
  ))

    // `share`ing the observable between many subscribers:
    ::share();

  // The `translateX` value at the start of an interaction.
  // Typically this would be either 0 or `drawerWidth`, but since the user can initiate
  // an interaction *during the animation*, it may be every value inbetween.
  // We obtain it by sampling the translate X observable at the beginning of each interaction.
  ref.startTranslateX$ = ref.translateX$::sample(start$);

  // #### Tween observable
  // For the tween animations we first need an observable that tracks
  // the current velocity of the drawer,
  // which we will use to determine whether the drawer should flinging in its direction,
  // or snap back into place.
  const velocity$ = ref.translateX$
    ::timestamp()
    ::pairwise()
    // Since we are at the mercy of the browser firing move events,
    // we make sure that some time has passed since the last move event.
    ::filter(([{ timestamp: prevTime }, { timestamp: time }]) => time - prevTime > 0)
    // Now we are save to calculate the current velocity without divide by zero errors.
    ::map(([
      { value: prevX, timestamp: prevTime },
      { value: x, timestamp: time },
    ]) => (x - prevX) / (time - prevTime))
    // The initial velocity is zero.
    ::startWith(0);

  // There are 2 things that can trigger an animation:
  // 1. The end of an interaction, i.e. the user releases the finger/mouse while moving the slider.
  // 2. A call to a method like `open` or `close` (represented by a value on the animate observable)
  const tweenTrigger$ = Observable::merge(
      // 1) When the user releases the finger/mouse, we take the current velocity of the drawer and
      // calculate whether it should open or close.
      end$
        ::withLatestFrom(ref.translateX$, velocity$)
        ::map(([, translateX, velocity]) => this::calcWillOpen(velocity, translateX))
        ::tap(willOpen => this[sFire]('slideend', { detail: willOpen })),

      // 2) In this case we need to call the prepare code directly,
      // which would have been called at the beginning of the interaction otherwise.
      this[sAnimateTo$]::tap(this::prepareInteraction),
  );

  // We silently set the new `opened` state here,
  // so that the next interaction will do the right thing even while the animation is
  // still playing, e.g. a call to `toggle` will cancel the current animation
  // and initiate an animation to the opposite state.
  ref.tween$ = tweenTrigger$
    ::tap((willOpen) => {
      this[sSetState]('opened', willOpen);
      if (this[sScrollEl] && !willOpen) this[sScrollEl].style.overflow = '';
    })
    // By using `switchMap` we ensure that subsequent events that trigger an animation
    // don't cause more than one animation to be played at a time.
    ::withLatestFrom(ref.translateX$)
    ::switchMap(([opened, translateX]) => {
      // We return a tween observable that runs cleanup code when it completes
      // --- unless a new interaction is initiated, in which case it is canceled.
      const inv = this.align === 'left' ? 1 : -1;
      const endTranslateX = opened ? this[sDrawerWidth] * inv : 0;
      const diffTranslateX = endTranslateX - translateX;

      return createTween(linearTween, translateX, diffTranslateX, TRANSITION_DURATION)
        ::tap({ complete: () => this[sOpened$].next(opened) })
        ::takeUntil(start$)
        ::takeUntil(this[sAlign$]);
    });

  // #### Subscriptions
  // Now we are ready to cause some side effects.
  //
  // The end result is always to update the (shadow) DOM, which happens here.
  // Note that the call to subscribe sets the whole process in motion,
  // and causes the code inside the above `defer` observables to run.
  ref.translateX$.subscribe(updateDOM.bind(this));

  // A click on the scrim should close the drawer.
  Observable::fromEvent(this[sScrimEl], 'click')
    .subscribe(() => this.close());

  // Other than preventing sliding, setting `persistent` will also hide the scrim.
  active$.subscribe((active) => {
    this[sScrimEl].style.display = active ? 'block' : 'none';
  });

  // Whenever the alignment of the drawer changes, update the CSS classes.
  this[sAlign$]
    .subscribe((align) => {
      const oldAlign = align === 'left' ? 'right' : 'left';
      this[sContentEl].classList.remove(`hy-drawer-${oldAlign}`);
      this[sContentEl].classList.add(`hy-drawer-${align}`);
    });

  // If the experimental back button feature is enabled, handle popstate events...
  Observable::fromEvent(window, 'popstate')
    ::subscribeWhen(this[sBackButton$])
    .subscribe(() => {
      const hash = `#${this::histId()}--opened`;
      const willOpen = window.location.hash === hash;
      if (willOpen !== this.opened) this[sAnimateTo$].next(willOpen);
    });

  // Now we set the initial opend state.
  // If the experimental back button feature is enabled, we check the location hash...
  if (this._backButton) {
    const hash = `#${this::histId()}--opened`;
    if (window.location.hash === hash) this[sSetState]('opened', true);
  }

  // Putting initial values on the side-effect--observables:
  this[sOpened$].next(this.opened);
  this[sAlign$].next(this.align);
  this[sPersitent$].next(this.persistent);
  this[sPreventDefault$].next(this.preventDefault);
  this[sMouseEvents$].next(this.mouseEvents);
  this[sBackButton$].next(this._backButton);
}

// ## Drawer Mixin
export function drawerMixin(C) {
  // TODO: see ES6 mixins...
  return class extends componentMixin(C) {
    // The name of the component (required by hy-component)
    static get componentName() { return 'hy-drawer'; }

    // ### Setup
    // Overriding the setup function.
    [sSetup](el, props) {
      super[sSetup](el, props);

      // Cache DOM elements.
      this[sScrimEl] = this.root.querySelector('.hy-drawer-scrim');
      this[sContentEl] = this.root.querySelector('.hy-drawer-content');
      if (this._hideOverflow) this[sScrollEl] = document.querySelector(this._hideOverflow);

      // Set the initial alignment class.
      this[sContentEl].classList.add(`hy-drawer-${this.align}`);

      // Measure the current drawer width...
      this[sDrawerWidth] = this::getMovableDrawerWidth();

      // ...and keep it up-to-date.
      // Note that we need to temporarily remove the opened class to get the correct measures.
      Observable::fromEvent(window, 'resize', { passive: true })
        ::debounceTime(100)
        .subscribe(() => {
          if (this.opened) this[sContentEl].classList.remove('hy-drawer-opened');
          this[sDrawerWidth] = this::getMovableDrawerWidth();
          if (this.opened) this[sContentEl].classList.add('hy-drawer-opened');
        });

      // Finally, calling the [setup observables function](#setup-observables) function.
      this::setupObservables();

      // Firing an event to let the outside world know the drawer is ready.
      this[sFire]('init', { detail: this.opened });

      // Allow function chaining.
      return this;
    }

    // ### Options
    // The default values (and types) of the configuration options (required by hy-component)
    // See [Options](../../options.md) for usage information.
    static get defaults() {
      return {
        opened: false,
        align: 'left',
        persistent: false,
        range: [0, 100],
        threshold: 10,
        preventDefault: false,
        mouseEvents: false,
        _backButton: false,
        _hideOverflow: null,
      };
    }

    static get types() {
      return {
        opened: bool,
        align: oneOf(['left', 'right']),
        persistent: bool,
        range: arrayOf(number),
        threshold: number,
        preventDefault: bool,
        mouseEvents: bool,
        _backButton: bool,
        _hideOverflow: string,
      };
    }

    // Side effects of changing configuration options (if any).
    // Mostly we just put the value on an observable and deal with it from there.
    static get sideEffects() {
      return {
        opened(x) { this[sOpened$].next(x); },
        align(x) { this[sAlign$].next(x); },
        persistent(x) { this[sPersitent$].next(x); },
        preventDefault(x) { this[sPreventDefault$].next(x); },
        mouseEvents(x) { this[sMouseEvents$].next(x); },
        _backButton(x) { this[sBackButton$].next(x); },
        _hideOverflow(selector) {
          if (this[sScrollEl]) this[sScrollEl].style.overflow = '';
          this[sScrollEl] = document.querySelector(selector);
        },
      };
    }

    // ### Methods
    // Public methods of this component. See [Methods](../../methods.md) for more.
    open(animated = true) {
      if (animated) this[sAnimateTo$].next(true);
      else this.opened = true;
    }

    close(animated = true) {
      if (animated) this[sAnimateTo$].next(false);
      else this.opened = false;
    }

    toggle(animated = true) {
      if (animated) this[sAnimateTo$].next(!this.opened);
      else this.opened = !this.opened;
    }
  };
}

// This concludes the implementation of push-state mixin.
// You can now check out
//
// * [vanilla / index.js](../vanilla/index.md)
// * [jquery / index.js](../jquery/index.md)
// * [webcomponent / index.js](../webcomponent/index.md)
//
// to see how it is used.
//
// [rxjs]: https://github.com/ReactiveX/rxjs
// [esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
// [modernizr]: https://modernizr.com/
