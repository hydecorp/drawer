# src / mixin / methods.js
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


```js

import 'core-js/fn/function/bind';
import 'core-js/fn/object/assign';

import { sFire } from 'hy-component/src/symbols';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';

import {
  tap,
  filter,
  map,
  mapTo,
  skipWhile,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import { subscribeWhen } from './operators';

import {
  VELOCITY_THRESHOLD,
  sPreventDefault$,
  sMouseEvents$,
  sScrimEl,
  sContentEl,
  sTranslateX,
  sOpacity,
} from './constants';
```

Using shorthands for common functions


```js
const assign = Object.assign.bind(this);
const abs = Math.abs.bind(this);
const min = Math.min.bind(this);
const max = Math.max.bind(this);
```

### Private Methods
The functions are used as "private" methods on the mixin, using the `::` syntax.


```js
export function histId() {
  return this.el.id || this.constructor.componentName;
}
```

#### Is in range?
Given a x-coordinate, `isInRange` will  determine whether it is within range from where
to pull the drawer. The x-coordinate *must* be larger than the lower bound,
but when the drawer is opened it may be anywhere on the screen.
Otherwise it must be below the upper bound.


```js
export function calcIsInRange(clientX, opened) {
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
```

#### Calculate 'Is swipe?'
If the start and end position are not the same x-coordinate, we call it a 'swipe'.
However, if a tap occures during an animation (i.e. `translateX` not in a resting position)
we treat it as a swipe as well. The reasons for this are pretty complex:
Basically, we want users the be able to stop the animation by putting a finger on the screen.
However, if they lift the finger again without swiping, the animation would not continue,
because it would not pass the condition below, unless we introduce the second term.
TODO: reuse isSlidign observable?


```js
export function calcIsSwipe([{ clientX: endX }, { clientX: startX }, translateX]) {
  return endX !== startX || (translateX > 0 && translateX < this.drawerWidth);
}
```

#### Calculate 'Will open?'
Based on current velocity and position of the drawer,
should the drawer slide open, or snap back?
TODO: could incorporate the current open state of the drawer.


```js
export function calcWillOpen([,, translateX, velocity]) {
  switch (this.align) {
    case 'left': {
      if (velocity > VELOCITY_THRESHOLD) return true;
      else if (velocity < -VELOCITY_THRESHOLD) return false;
      else if (translateX >= this.drawerWidth / 2) return true;
      else return false;
    }
    case 'right': {
      if (-velocity > VELOCITY_THRESHOLD) return true;
      else if (-velocity < -VELOCITY_THRESHOLD) return false;
      else if (translateX <= -this.drawerWidth / 2) return true;
      else return false;
    }
    default:
      throw Error();
  }
}
```

#### Calculate translate X
Calcuate the current position of the drawer,
by taking the difference between the current and starting postion of the finger,
then adding that difference to the starting position of the drawer.
This way, we avoid the drawer jumping to the finger, when "catching" it during an animation.
The function will also clip the position at 0 and the width of the drawer.


```js
export function calcTranslateX(clientX, startX, startTranslateX) {
  switch (this.align) {
    case 'left': {
      const deltaX = clientX - startX;
      const translateX = startTranslateX + deltaX;
      return max(0, min(this.drawerWidth, translateX));
    }
    case 'right': {
      const deltaX = clientX - startX;
      const translateX = startTranslateX + deltaX;
      return min(0, max(-this.drawerWidth, translateX));
    }
    default:
      throw Error();
  }
}
```

#### Get movable drawer width
One feature of hy-drawer is to allow the drawer to "peek" over the edge.
This effect is achieved by setting a smaller negative `left` (`right`) CSS property,
than is the width of the drawer,
The 'moveable' part of the drawer, then, is equal to that the inverse of that property.
See [Styling](../../styling.md) for more.


```js
export function getMovableDrawerWidth() {
  return -parseFloat(getComputedStyle(this[sContentEl])[this.align]);
}
```

#### Prepare and cleanup interaction
`prepareInteraction` causes various side effects before sliding the drawer.

Note that the drawer receives the `hy-drawer-opened` CSS class when it is opened.
This class makes the drawer appear open by setting the CSS `left` (`right`) property, instead
of an absoulte `transform` value.
This way, the drawer's width can change while it is open without having to
recalculate `translateX` on every `resize`.
However, it has to be removed before we move the drawer via `translateX` again.


```js
export function prepareInteraction() {
  this[sContentEl].style.willChange = 'transform';
  this[sScrimEl].style.willChange = 'opacity';
  this[sContentEl].classList.remove('hy-drawer-opened');
  this[sFire]('prepare');
}
```

Cleanup code after a completed interaction.
Will add/remove the beforementioned `hy-drawer-opened` class.


```js
export function cleanupInteraction(opened) {
  this[sScrimEl].style.willChange = '';
  this[sContentEl].style.willChange = '';

  if (opened) {
    this[sScrimEl].style.pointerEvents = 'all';
    this[sContentEl].classList.add('hy-drawer-opened');
  } else {
    this[sScrimEl].style.pointerEvents = '';
    this[sContentEl].classList.remove('hy-drawer-opened');
  }
```

If the experimental back button feature is enabled we hack the history API,
so that it matches the state of the drawer...


```js
  if (this._backButton) {
    const id = histId.call(this);
    const hash = `#${id}--opened`;

    if (opened && window.location.hash !== hash) {
      window.history.pushState({ [id]: true }, document.title, hash);
    }

    if (!opened
        && (window.history.state && window.history.state[histId.call(this)])
        && window.location.hash !== '') {
      window.history.back();
    }
  }
```

Once we're finished cleaning up, we fire the `transitioned` event.


```js
  this[sFire]('transitioned', { detail: opened });
}
```

#### Update DOM
In the end, we only modify two properties: The x-coordinate of the drawer,
and the opacity of the scrim, which is handled by `updateDOM`.


```js
export function updateDOM(translateX) {
  this[sTranslateX] = translateX;

  const inv = this.align === 'left' ? 1 : -1;
  const opacity = this[sOpacity] = (translateX / this.drawerWidth) * inv;

  this[sContentEl].style.transform = `translateX(${translateX}px)`;
  this[sScrimEl].style.opacity = this.opacity;

  this[sFire]('move', { detail: { translateX, opacity } });
}
```

#### Get start observable
The following function returns an observable of all "start" events.
Usually, that's just `touchstart` event of the first finger touching the screen,
however since the compontent also supports mouse events,
we may listen for `mousedown` events.


```js
export function getStartObservable() {
```

Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.


```js
  return this[sMouseEvents$].pipe(switchMap((mouseEvents) => {
```

The touchstart observable is passive since we won't be calling `preventDefault`.
Also, we're only interested in the first `touchstart`.


```js
    const touchstart$ = fromEvent(document, 'touchstart', { passive: true }).pipe(
      filter(({ touches }) => touches.length === 1),
      map(({ touches }) => touches[0]),
    );
```

If mouse events aren't enabled, we're done here.


```js
    if (!mouseEvents) return touchstart$;
```

Otherwise we also include `mousedown` events in the output.


```js
    const mousedown$ = fromEvent(document, 'mousedown')
      .pipe(tap(event => assign(event, { event })));

    return merge(touchstart$, mousedown$);
  }));
}
```

#### Get move observable
This function returns an observable of all move events. Usually that's just `touchmove`,
but may also include `mousemove` events while the mouse button is down.


```js
export function getMoveObservable(start$, end$) {
```

Since the `mouseEvents` or `preventDefault` option may change at any point,
we `switchMap` to reflect the changes.
Nice: `combineLatest` provides us with the functionality of emitting
when either of the inputs change, but not before all inputs have their first value set.


```js
  return combineLatest(this[sMouseEvents$], this[sPreventDefault$])
    .pipe(switchMap(([mouseEvents, preventDefault]) => {
```

We're only keeping track of the first finger.
Should the user remove the finger that started the interaction, we use the next instead.
Note that this doesn't occur under normal circumstances,
and exists primarliy to ensure that the interaction continues without hiccups.
Note that the event listener is only passive when the `preventDefault` option is falsy.


```js
      const touchmove$ = fromEvent(document, 'touchmove', { passive: !preventDefault })
        .pipe(map(event => assign(event.touches[0], { event })));
```

If mouse events aren't enabled, we're done here.


```js
      if (!mouseEvents) return touchmove$;
```

Otherwise we listen for `mousemove` events,
but only those between a `start` and `end` event, i.e. while the user is sliding.
We unsubscribe form the source observable outside of those contraints.
Again, the listener is only marked as passive when the `preventDefault` option is falsy.


```js
      const mousemove$ = fromEvent(document, 'mousemove', { passive: !preventDefault }).pipe(
        subscribeWhen(merge(
          start$.pipe(mapTo(true)),
          end$.pipe(mapTo(false)),
        )),
        map(event => assign(event, { event })),
      );

      return merge(touchmove$, mousemove$);
    }));
}
```

#### Get end observable
This function returns an observable of end events.
Usually, this is the `touchend` event of the last finger, but may also include `mouseup` events,
when the `mouseEvents` option is enabled.


```js
export function getEndObservable() {
```

Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.


```js
  return this[sMouseEvents$].pipe(switchMap((mouseEvents) => {
```

We're only interested in the last `touchend`.
Otherwise there's at least one finger left on the screen,
that can be used to slide the drawer.


```js
    const touchend$ = fromEvent(document, 'touchend', { passive: true }).pipe(
      filter(({ touches }) => touches.length === 0),
      map(event => event.changedTouches[0]),
    );
```

If mouse events aren't enabled, we're done here.


```js
    if (!mouseEvents) return touchend$;
```

Otherwise we include `mouseup` events.


```js
    const mouseup$ = fromEvent(document, 'mouseup', { passive: true });
    return merge(touchend$, mouseup$);
  }));
}
```

#### Get "Is sliding?" observable
An observable that emits `true` when the user is *sliding* the drawer,
(i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
(i.e. moving the finger along the y-axis).


```js
export function getIsSlidingObservable(move$, start$) {
```

If the threshold options is set, we delay the decision until
the finger has moved at least `threshold` pixels in either direction.


```js
  if (this.threshold) {
    return move$.pipe(
      withLatestFrom(start$),
      skipWhile(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startY - clientY) < this.threshold && abs(startX - clientX) < this.threshold),
      map(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
        abs(startX - clientX) >= abs(startY - clientY)),
    );
```

If the threshold option is set to `0` (or `false`) we make a decision immediately.
This is intended for Safari and possibly other browsers that have a built-in threshold.
Additionally, Safari ignores all calls to `preventDefault`, except on the first move event
after a start event, so that we *have to* make a decision immediately.


```js
  } else {
    return move$.pipe(
      withLatestFrom(start$),
      map(([{ clientX, clientY, event }, { clientX: startX, clientY: startY }]) => {
        const isSliding = abs(startX - clientX) >= abs(startY - clientY);
        if (this.preventDefault && isSliding) event.preventDefault();
        return isSliding;
      }),
    );
  }
}
```


