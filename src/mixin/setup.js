// # src / mixin / setup.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

// As mentioned before, we only import the RxJS function that we need.
import { Subject } from 'rxjs';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { never } from 'rxjs/observable/never';

import {
  tap,
  filter,
  map,
  pairwise,
  repeatWhen,
  sample,
  share,
  startWith,
  switchMap,
  take,
  takeUntil,
  timestamp,
  withLatestFrom,
} from 'rxjs/operators';

import { createTween } from 'rxjs-create-tween';

import { easeOutSine } from '../common';

import {
  BASE_DURATION,
  WIDTH_CONTRIBUTION,
} from './constants';

import { filterWhen, subscribeWhen } from './operators';

import {
  calcIsInRange,
  calcIsSwipe,
  calcWillOpen,
  calcTranslateX,
  calcMovableDrawerWidth,
} from './calc';

import {
  histId,
  prepareInteraction,
  cleanupInteraction,
  updateDOM,
} from './update';

import {
  getStartObservable,
  getMoveObservable,
  getEndObservable,
  getIsSlidingObservable,
} from './observables';

// ### Setup observables
// This function sets up the observable "pipeline".
export function setupObservables() {
  // Observables used for side effects caused by changing settings on the component.
  // The are used to emit the new vale whenever properties get changed on the component.
  this.opened$ = new Subject();
  this.align$ = new Subject();
  this.persitent$ = new Subject();
  this.preventDefault$ = new Subject();
  this.mouseEvents$ = new Subject();
  this.backButton$ = new Subject();
  this.animateTo$ = new Subject();

  // An observable of resize events.
  const resize$ = fromEvent(window, 'resize', { passive: true }).pipe(
    /* debounceTime(100), */
    share(),
    startWith({}),
  );

  // Keep measurements up-to-date.
  // Note that we need to temporarily remove the opened class to get the correct measures.
  resize$.subscribe(() => {
    if (this.opened) this.contentEl.classList.remove('hy-drawer-opened');
    this.drawerWidth = calcMovableDrawerWidth.call(this);
    if (this.opened) this.contentEl.classList.add('hy-drawer-opened');
  });

  // Emitts a value every time you change the `persistent` property of the drawer.
  // Interally, we invert it and call it `active`.
  const active$ = this.persitent$.pipe(
    map(x => !x),
    share(),
  );

  // We use this to get references to observables that aren't defined yet.
  const ref = {};

  // #### Start observable
  // Emits a value every time a start event *could* intiate an interaction.
  // Each emitted value is a hash containing a `clientX` and `clientY` key.
  const start$ = getStartObservable.call(this).pipe(
    filterWhen(active$),
    share(),
  );

  // An observable that emits `true`, as long as the drawer isn't fully closed
  // (as long as the scrim is visible the user can still "catch" the drawer).
  // It references the yet-to-be-defined `translateX` obsevable, so we wrap it inside a `defer`.
  const isScrimVisible$ = defer(() =>
    ref.translateX$.pipe(map(translateX => (this.align === 'left' ?
      translateX > 0 :
      translateX < this.drawerWidth))));

  // TODO: ...
  const isInRange$ = start$.pipe(
    withLatestFrom(isScrimVisible$),
    map(([{ clientX }, isScrimVisible]) => calcIsInRange.call(this, clientX, isScrimVisible)),
    tap((inRange) => {
      if (inRange) {
        if (this.mouseEvents) this.contentEl.classList.add('hy-drawer-grabbing');
        prepareInteraction.call(this);
      }
    }),
    share(),
  );

  // #### End observable
  // The observable of all relevant "end" events, i.e. the last `touchend` (or `mouseup`),
  const end$ = getEndObservable.call(this).pipe(
    filterWhen(active$, isInRange$),
    share(),
  );

  // #### Move observable
  // The observable of all relevant "move" events.
  const move$ = getMoveObservable.call(this, start$, end$).pipe(
    filterWhen(active$, isInRange$),
    share(),
  );

  // #### 'Is sliding?' observable
  // The value is `undefind` until we are ready to make a decision
  // An observable that emits `true` when the user is *sliding* the drawer,
  // (i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
  // (i.e. moving the finger along the y-axis), and `undefined` while we aren't sure yet.
  //
  // (see [`getIsSlidingObservable`](#get-is-sliding-observable)),
  // then it remains `true`/`false` for the remainder of the interaction,
  // and is `undefined` again once the interaction `end`s.
  const isSliding$ = getIsSlidingObservable.call(this, move$, start$).pipe(
    take(1),
    startWith(undefined),
    repeatWhen(() => end$),

    // When the user is sliding, fire the `slidestart` event.
    // Experimental: Set `overflow: hidden` on some container element.
    tap((isSliding) => {
      if (isSliding) {
        if (this.scrollEl) this.scrollEl.style.overflow = 'hidden';
        this.fireEvent('slidestart', { detail: this.opened });
      }
    }),
  );

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
  ref.translateX$ = defer(() => merge(
    // 1)
    // We only let move events modify the drawer's position when we are sure
    // that the user is sliding. In case the `preventDefault` option is enabled,
    // this is also when we're sure to call `preventDefault`.
    move$.pipe(
      filterWhen(isSliding$),
      tap(({ event }) => { if (this.preventDefault) event.preventDefault(); }),

      // Finally, we take the start position of the finger, the start position of the drawer,
      // and the current position of the finger to calculate the next `translateX` value.
      withLatestFrom(start$, ref.startTranslateX$),
      map(([{ clientX }, { clientX: startX }, startTranslateX]) =>
        calcTranslateX.call(this, clientX, startX, startTranslateX)),
    ),

    // 2)
    // The tween observable can be used unmodified (see below),
    // but isn't defined yet, because it depends on previous values of `translateX$`.
    ref.tween$,

    // 3)
    // When the `opened` state changes, we "jump" to the new position,
    // which is either 0 (when closed) or the width of the drawer (when open).
    // We also want to jump when `align` chagnes, in this case to the other side of the viewport.
    combineLatest(this.opened$, this.align$).pipe(
      // Usually the cleanup code would run at the end of the fling animation,
      // but since there is no animation in this case, we call it directly.
      tap(([opened]) => cleanupInteraction.call(this, opened)),
      map(([opened, align]) => (!opened
        ? 0
        : this.drawerWidth * (align === 'left' ? 1 : -1))),
    ),
  ))

    // `share`ing the observable between many subscribers:
    .pipe(share());

  // The `translateX` value at the start of an interaction.
  // Typically this would be either 0 or `drawerWidth`, but since the user can initiate
  // an interaction *during the animation*, it may be every value inbetween.
  // We obtain it by sampling the translate X observable at the beginning of each interaction.
  ref.startTranslateX$ = ref.translateX$.pipe(sample(start$));

  // #### Tween observable
  // For the tween animations we first need an observable that tracks
  // the current velocity of the drawer,
  // which we will use to determine whether the drawer should flinging in its direction,
  // or snap back into place.
  const velocity$ = ref.translateX$.pipe(
    timestamp(),
    pairwise(),
    // Since we are at the mercy of the browser firing move events,
    // we make sure that some time has passed since the last move event.
    filter(([{ timestamp: prevTime }, { timestamp: time }]) => time - prevTime > 0),
    // Now we are save to calculate the current velocity without divide by zero errors.
    map(([
      { value: prevX, timestamp: prevTime },
      { value: x, timestamp: time },
    ]) => (x - prevX) / (time - prevTime)),
    // The initial velocity is zero.
    startWith(0),
  );

  // TODO
  const willOpen$ = end$.pipe(
    tap(() => { this.contentEl.classList.remove('hy-drawer-grabbing'); }),
    withLatestFrom(start$, ref.translateX$, velocity$),
    filter(calcIsSwipe.bind(this)),
    map(calcWillOpen.bind(this)),
    // TODO: only fire `slideend` event when slidestart fired as well!?
    tap(willOpen => this.fireEvent('slideend', { detail: willOpen })),
  );

  // There are 2 things that can trigger an animation:
  // 1. The end of an interaction, i.e. the user releases the finger/mouse while moving the slider.
  // 2. A call to a method like `open` or `close` (represented by a value on the animate observable)
  //    Note that we call `prepareInteraction` manually here, because it wasn't triggered by a
  //    prior `touchdown`/`mousedown` event in this case.
  const tweenTrigger$ = merge(
    willOpen$,
    this.animateTo$.pipe(tap(prepareInteraction.bind(this))),
  );

  // We silently set the new `opened` state here,
  // so that the next interaction will do the right thing even while the animation is
  // still playing, e.g. a call to `toggle` will cancel the current animation
  // and initiate an animation to the opposite state.
  ref.tween$ = tweenTrigger$.pipe(
    tap((willOpen) => {
      this.setInternalState('opened', willOpen);
      if (this.scrollEl && !willOpen) this.scrollEl.style.overflow = '';
    }),
    // By using `switchMap` we ensure that subsequent events that trigger an animation
    // don't cause more than one animation to be played at a time.
    withLatestFrom(ref.translateX$),
    switchMap(([opened, translateX]) => {
      // We return a tween observable that runs cleanup code when it completes
      // --- unless a new interaction is initiated, in which case it is canceled.
      const inv = this.align === 'left' ? 1 : -1;
      const endTranslateX = opened ? this.drawerWidth * inv : 0;
      const diffTranslateX = endTranslateX - translateX;
      const duration = BASE_DURATION + (this.drawerWidth * WIDTH_CONTRIBUTION);

      return createTween(easeOutSine, translateX, diffTranslateX, duration).pipe(
        tap({ complete: () => this.opened$.next(opened) }),
        takeUntil(start$),
        takeUntil(this.align$),
      );
    }),
  );

  // #### Subscriptions
  // Now we are ready to cause some side effects.
  //
  // The end result is always to update the (shadow) DOM, which happens here.
  // Note that the call to subscribe sets the whole process in motion,
  // and causes the code inside the above `defer` observables to run.
  ref.translateX$.subscribe(updateDOM.bind(this));

  // A click on the scrim should close the drawer.
  fromEvent(this.scrimEl, 'click')
    .subscribe(() => this.close());

  // Other than preventing sliding, setting `persistent` will also hide the scrim.
  active$.subscribe((active) => {
    this.scrimEl.style.display = active ? 'block' : 'none';
  });

  // Whenever the alignment of the drawer changes, update the CSS classes.
  this.align$
    .subscribe((align) => {
      const oldAlign = align === 'left' ? 'right' : 'left';
      this.contentEl.classList.remove(`hy-drawer-${oldAlign}`);
      this.contentEl.classList.add(`hy-drawer-${align}`);
    });

  // If the experimental back button feature is enabled, handle popstate events...
  fromEvent(window, 'popstate')
    .pipe(subscribeWhen(this.backButton$))
    .subscribe(() => {
      const hash = `#${histId.call(this)}--opened`;
      const willOpen = window.location.hash === hash;
      if (willOpen !== this.opened) this.animateTo$.next(willOpen);
    });

  // When drawing with mouse is enabled, we add the grab cursor to the drawer.
  // We also want to call `preventDefault` when `mousedown` is within the drawer range
  // to prevent text selection while sliding.
  this.mouseEvents$.pipe(switchMap((mouseEvents) => {
    if (mouseEvents) this.contentEl.classList.add('hy-drawer-grab');
    else this.contentEl.classList.remove('hy-drawer-grab');

    return mouseEvents ?
      start$.pipe(withLatestFrom(isInRange$)) :
      never();
  }))
    .subscribe(([{ event }, isInRange]) => {
      if (isInRange && event) event.preventDefault();
    });

  // Now we set the initial opend state.
  // If the experimental back button feature is enabled, we check the location hash...
  if (this._backButton) {
    const hash = `#${histId.call(this)}--opened`;
    if (window.location.hash === hash) this.setInternalState('opened', true);
  }

  // Putting initial values on the side-effect--observables:
  this.opened$.next(this.opened);
  this.align$.next(this.align);
  this.persitent$.next(this.persistent);
  this.preventDefault$.next(this.preventDefault);
  this.mouseEvents$.next(this.mouseEvents);
  this.backButton$.next(this._backButton);
}
