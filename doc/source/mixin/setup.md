# src / mixin / setup.js
Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

As mentioned before, we only import the RxJS function that we need.


```js
import {
  animationFrameScheduler,
  combineLatest,
  defer,
  fromEvent,
  merge,
  NEVER,
  of,
} from "rxjs/_esm5";

import {
  tap,
  filter,
  map,
  pairwise,
  sample,
  share,
  skip,
  startWith,
  switchMap,
  observeOn,
  takeUntil,
  timestamp,
  withLatestFrom,
} from "rxjs/_esm5/operators";

import { createTween } from "rxjs-create-tween";

import { createXObservable } from "hy-component/src/rxjs";

import { easeOutSine } from "../common";

import { BASE_DURATION, WIDTH_CONTRIBUTION } from "./constants";
import { filterWhen } from "./operators";

import { calcMixin } from "./calc";
import { updateMixin } from "./update";
import { baseObservablesMixin } from "./observables";
```

### Setup observables
This function sets up the observable "pipeline".


```js
export const setupObservablesMixin = C =>
  class extends baseObservablesMixin(updateMixin(calcMixin(C))) {
    setupObservables() {
      const initialRect = { contentRect: this.contentEl.getBoundingClientRect() };

      const resize$ =
        "ResizeObserver" in window
          ? createXObservable(ResizeObserver)(this.contentEl).pipe(startWith(initialRect))
          : of(initialRect);

      let drawerWidth$ = resize$.pipe(
        takeUntil(this.subjects.disconnect),
        map(({ contentRect }) => contentRect.width),
        share(),
        startWith(initialRect.contentRect.width)
      );
```

HACK: peek feature has been removed, but still needed for hydejack...


```js
      if (/* process.env.HYDEJACK && */ this._peek$) {
        drawerWidth$ = combineLatest(drawerWidth$, this._peek$).pipe(
          map(([drawerWidth, peek]) => drawerWidth - peek)
        );
      }
```

Emitts a value every time you change the `persistent` property of the drawer.
Interally, we invert it and call it `active`.


```js
      const active$ = this.subjects.persistent.pipe(map(x => !x));
```

#### Start observable
Emits a value every time a start event *could* intiate an interaction.
Each emitted value is a hash containing a `clientX` and `clientY` key.


```js
      const start$ = this.getStartObservable().pipe(
        takeUntil(this.subjects.disconnect),
        filterWhen(active$),
        share()
      );
```

An observable that emits `true`, as long as the drawer isn't fully closed
(as long as the scrim is visible the user can still "catch" the drawer).
It references the yet-to-be-defined `translateX` obsevable, so we wrap it inside a `defer`.


```js
      const isScrimVisible$ = defer(() =>
        this.translateX$.pipe(map(translateX => translateX != 0))
      );
```

TODO: ...


```js
      const isInRange$ = start$.pipe(
        withLatestFrom(isScrimVisible$),
        map(([{ clientX }, isScrimVisible]) => this.calcIsInRange(clientX, isScrimVisible)),
        tap(inRange => {
          if (inRange) {
            if (this.mouseEvents) this.contentEl.classList.add("hy-drawer-grabbing");
            this.prepareInteraction();
          }
        }),
        share()
      );
```

#### End observable
The observable of all relevant "end" events, i.e. the last `touchend` (or `mouseup`),


```js
      const end$ = this.getEndObservable().pipe(
        takeUntil(this.subjects.disconnect),
        filterWhen(active$, isInRange$),
        share()
      );
```

#### Move observable
The observable of all relevant "move" events.


```js
      const move$ = this.getMoveObservable(start$, end$).pipe(
        takeUntil(this.subjects.disconnect),
        filterWhen(active$, isInRange$),
        share()
      );
```

#### 'Is sliding?' observable
An observable that emits `true` when the user is *sliding* the drawer,
(i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
(i.e. moving the finger along the y-axis), and `undefined` while we aren't sure yet.

See [`getIsSlidingObservable`](./observables.md#get-is-sliding-observable).


```js
      const isSliding$ = this.getIsSlidingObservable(move$, start$, end$).pipe(
        tap(isSliding => {
          if (isSliding) this.fireEvent("slidestart", { detail: this.opened });
        })
      );
```

#### Translate X observable
The `translateX` observable is the central observable of this component.
It emits the current x-coordinate of the drawer, which
can be modified by either of 3 incoming observables:

1. the animation/tween observable, and
2. The move observable (the user's finger/mouse moving across the screen),
3. direct modifications of the `opened` state.

It is wrapped in a `defer` because it depends on previous values of itself.


```js
      this.translateX$ = defer(() =>
        merge(
```

1)
The tween observable can be used unmodified (see below),
but isn't defined yet, because it depends on previous values of `translateX$`.


```js
          this.tween$,
```

2)
We only let move events modify the drawer's position when we are sure
that the user is sliding. In case the `preventDefault` option is enabled,
this is also when we're sure to call `preventDefault`.


```js
          move$.pipe(
            filterWhen(isSliding$),
            tap(({ event }) => this.preventDefault && event.preventDefault()),
```

Finally, we take the start position of the finger, the start position of the drawer,
and the current position of the finger to calculate the next `translateX` value.


```js
            withLatestFrom(start$, this.startTranslateX$, drawerWidth$),
            observeOn(animationFrameScheduler),
            map(([{ clientX }, { clientX: startX }, startTranslateX, drawerWidth]) => {
              return this.calcTranslateX(clientX, startX, startTranslateX, drawerWidth);
            })
          ),
```

3)
When the `opened` state changes, we "jump" to the new position,
which is either 0 (when closed) or the width of the drawer (when open).


```js
          combineLatest(this.subjects.opened, this.subjects.align, drawerWidth$).pipe(
```

Usually the cleanup code would run at the end of the fling animation,
but since there is no animation in this case, we call it directly.


```js
            tap(([opened]) => this.cleanupInteraction(opened)),
            map(([opened, align, drawerWidth]) => {
              return !opened ? 0 : drawerWidth * (align === "left" ? 1 : -1);
            })
          )
        )
      )
```

`share`ing the observable between many subscribers:


```js
        .pipe(
          takeUntil(this.subjects.disconnect),
          share()
        );
```

The `translateX` value at the start of an interaction.
Typically this would be either 0 or `drawerWidth`, but since the user can initiate
an interaction *during the animation*, it could also be any value inbetween.
We obtain it by sampling the translate-x observable at the beginning of each interaction.


```js
      this.startTranslateX$ = this.translateX$.pipe(sample(start$));
```

#### Tween observable
For the tween animations we first need an observable that tracks
the current velocity of the drawer,
which we will use to determine whether the drawer should flinging in its direction,
or snap back into place.


```js
      const velocity$ = this.translateX$.pipe(
        timestamp(),
        pairwise(),
```

Since we are at the mercy of the browser firing move events,
we make sure that some time has passed since the last move event.


```js
        filter(([{ timestamp: prevTime }, { timestamp: time }]) => time - prevTime > 0),
```

Now we are save to calculate the current velocity without divide by zero errors.


```js
        map(
          ([{ value: prevX, timestamp: prevTime }, { value: x, timestamp: time }]) =>
            (x - prevX) / (time - prevTime)
        ),
```

The initial velocity is zero.


```js
        startWith(0)
      );
```

TODO


```js
      const willOpen$ = end$.pipe(
        tap(() => this.contentEl.classList.remove("hy-drawer-grabbing")),
        withLatestFrom(start$, this.translateX$, drawerWidth$, velocity$),
        filter(this.calcIsSwipe.bind(this)),
        map(this.calcWillOpen.bind(this)),
```

TODO: only fire `slideend` event when slidestart fired as well?


```js
        tap(willOpen => this.fireEvent("slideend", { detail: willOpen }))
      );
```

There are 2 things that can trigger an animation:
1. The end of an interaction, i.e. the user releases the finger/mouse while moving the slider.
2. A call to a method like `open` or `close` (represented by a value on the animate observable)
   Note that we call `prepareInteraction` manually here, because it wasn't triggered by a
   prior `touchdown`/`mousedown` event in this case.


```js
      const willOpen2$ = merge(
        willOpen$,
        this.animateTo$.pipe(tap(this.prepareInteraction.bind(this)))
      );
```

We silently set the new `opened` state here,
so that the next interaction will do the right thing even while the animation is
still playing, e.g. a call to `toggle` will cancel the current animation
and initiate an animation to the opposite state.


```js
      this.tween$ = willOpen2$.pipe(
        tap(willOpen => this.setInternalState("opened", willOpen)),
```

By using `switchMap` we ensure that subsequent events that trigger an animation
don't cause more than one animation to be played at a time.


```js
        withLatestFrom(this.translateX$, drawerWidth$),
        switchMap(([opened, translateX, drawerWidth]) => {
```

We return a tween observable that runs cleanup code when it completes
--- unless a new interaction is initiated, in which case it is canceled.


```js
          const inv = this.align === "left" ? 1 : -1;
          const endTranslateX = opened ? drawerWidth * inv : 0;
          const diffTranslateX = endTranslateX - translateX;
          const duration = BASE_DURATION + drawerWidth * WIDTH_CONTRIBUTION;

          return createTween(easeOutSine, translateX, diffTranslateX, duration).pipe(
            tap({ complete: () => this.subjects.opened.next(opened) }),
            takeUntil(start$),
            takeUntil(this.subjects.align.pipe(skip(1))),
            share()
          );
        })
      );
```

#### Subscriptions
Now we are ready to cause some side effects.

The end result is always to update the (shadow) DOM, which happens here.
Note that the call to subscribe sets the whole process in motion,
and causes the code inside the above `defer` observables to run.


```js
      this.translateX$
        .pipe(withLatestFrom(drawerWidth$))
        .subscribe(([translateX, drawerWidth]) => this.updateDOM(translateX, drawerWidth));
```

A click on the scrim should close the drawer.


```js
      fromEvent(this.scrimEl, "click")
        .pipe(takeUntil(this.subjects.disconnect))
        .subscribe(() => this.close());
```

Other than preventing sliding, setting `persistent` will also hide the scrim.


```js
      active$.pipe(takeUntil(this.subjects.disconnect)).subscribe(active => {
        this.scrimEl.style.display = active ? "block" : "none";
      });
```

Whenever the alignment of the drawer changes, update the CSS classes.


```js
      this.subjects.align.pipe(takeUntil(this.subjects.disconnect)).subscribe(align => {
        this.contentEl.classList.remove(`hy-drawer-left`);
        this.contentEl.classList.remove(`hy-drawer-right`);
        this.contentEl.classList.add(`hy-drawer-${align}`);
      });
```

If the experimental back button feature is enabled, handle popstate events...


```js
      /*
      fromEvent(window, "popstate")
        .pipe(
          takeUntil(this.subjects.disconnect),
          subscribeWhen(this.backButton$)
        )
        .subscribe(() => {
          const hash = `#${histId.call(this)}--opened`;
          const willOpen = window.location.hash === hash;
          if (willOpen !== this.opened) this.animateTo$.next(willOpen);
        });
      */
```

When drawing with mouse is enabled, we add the grab cursor to the drawer.
We also want to call `preventDefault` when `mousedown` is within the drawer range
to prevent text selection while sliding.


```js
      this.subjects.mouseEvents
        .pipe(
          takeUntil(this.subjects.disconnect),
          switchMap(mouseEvents => {
            if (mouseEvents) this.contentEl.classList.add("hy-drawer-grab");
            else this.contentEl.classList.remove("hy-drawer-grab");

            return mouseEvents ? start$.pipe(withLatestFrom(isInRange$)) : NEVER;
          })
        )
        .subscribe(([{ event }, isInRange]) => isInRange && event && event.preventDefault());
```

If the experimental back button feature is enabled, we check the location hash...


```js
      /*
      if (this._backButton) {
        const hash = `#${histId.call(this)}--opened`;
        if (window.location.hash === hash) this.setInternalState('opened', true);
      }
      */
```

Firing an event to let the outside world know the drawer is ready.


```js
      this.fireEvent("init", { detail: this.opened });
    }
  };
```


