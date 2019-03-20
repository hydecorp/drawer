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

import { Observable, combineLatest, fromEvent, merge, NEVER } from "rxjs";

import {
  // tap,
  filter,
  map,
  mapTo,
  repeatWhen,
  skipWhile,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators";

import { subscribeWhen } from "./common";

const abs = Math.abs.bind(Math);

export type Coord = {
  target: EventTarget;
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
  screenX?: number;
  screenY?: number;
  event?: Event;
}

export class ObservablesMixin {
  touchEvents$: Observable<boolean>;
  mouseEvents$: Observable<boolean>;
  preventDefault$: Observable<boolean>;

  threshold: number;
  preventDefault: boolean;

  getStartObservable() {
    return combineLatest(this.touchEvents$, this.mouseEvents$).pipe(
      switchMap(([touchEvents, mouseEvents]) => {
        const touchstart$ = !touchEvents
          ? NEVER
          : (fromEvent(document, "touchstart", {
            passive: true,
          }) as Observable<TouchEvent>).pipe(
            filter(({ touches }) => touches.length === 1),
            map(({ touches }) => touches[0] as Coord)
          );

        const mousedown$ = !mouseEvents
          ? NEVER
          : (fromEvent(document, "mousedown") as Observable<MouseEvent>).pipe(
            map((e) => (((e as Coord).event = e), e as Coord)),
          );

        return merge(touchstart$, mousedown$);
      })
    );
  }

  getMoveObservable(start$: Observable<Coord>, end$: Observable<Coord>) {
    return combineLatest(this.touchEvents$, this.mouseEvents$, this.preventDefault$).pipe(
      switchMap(([touchEvents, mouseEvents, preventDefault]) => {
        const touchmove$ = !touchEvents
          ? NEVER
          : (fromEvent(document, "touchmove", { 
            passive: !preventDefault 
          }) as Observable<TouchEvent>).pipe(
            map(e => (((e.touches[0] as Coord).event = e), e.touches[0] as Coord))
          );

        const mousemove$ = !mouseEvents
          ? NEVER
          : (fromEvent(document, "mousemove", {
            passive: !preventDefault,
          }) as Observable<TouchEvent>).pipe(
            subscribeWhen(merge(start$.pipe(mapTo(true)), end$.pipe(mapTo(false)))),
            map(e => (((e as Coord).event = e), e as Coord))
          );

        return merge(touchmove$, mousemove$);
      })
    );
  }

  getEndObservable() {
    return combineLatest(this.touchEvents$, this.mouseEvents$).pipe(
      switchMap(([touchEvents, mouseEvents]) => {
        const touchend$ = !touchEvents
          ? NEVER
          : (fromEvent(document, "touchend", { passive: true }) as Observable<TouchEvent>).pipe(
            filter(({ touches }) => touches.length === 0),
            map(event => event.changedTouches[0] as Coord)
          );

        const mouseup$ = !mouseEvents
          ? NEVER
          : fromEvent(document, "mouseup", { passive: true }) as Observable<Coord>;

        return merge(touchend$, mouseup$);
      })
    );
  }

  getIsSlidingObservable(move$: Observable<Coord>, start$: Observable<Coord>, end$: Observable<Coord>) {
    return this.getIsSlidingObservableInner(move$, start$).pipe(
      take(1),
      startWith(undefined),
      repeatWhen(() => end$)
    );
  }

  getIsSlidingObservableInner(move$: Observable<Coord>, start$: Observable<Coord>) {
    if (this.threshold) {
      return move$.pipe(
        withLatestFrom(start$),
        skipWhile(
          ([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
            abs(startY - clientY) < this.threshold && abs(startX - clientX) < this.threshold
        ),
        map(
          ([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
            abs(startX - clientX) >= abs(startY - clientY)
        )
      );
    } else {
      return move$.pipe(
        withLatestFrom(start$),
        map(([{ clientX, clientY, event }, { clientX: startX, clientY: startY }]) => {
          const isSliding = abs(startX - clientX) >= abs(startY - clientY);
          if (this.preventDefault && isSliding) event.preventDefault();
          return isSliding;
        })
      );
    }
  }
}
