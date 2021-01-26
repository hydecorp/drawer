import { Observable, combineLatest, fromEvent, merge, NEVER, ObservedValueOf } from "rxjs";

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
  readonly target: EventTarget;
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly screenX: number;
  readonly screenY: number;
  event?: Event;
}

export class ObservablesMixin {
  $!: {
    mouseEvents: Observable<boolean>;
    preventDefault: Observable<boolean>;
  }

  threshold!: number;
  noScroll!: boolean;

  getStartObservable() {
    return combineLatest([this.$.mouseEvents]).pipe(
      switchMap(([mouseEvents]) => {
        const touchstart$ = (<Observable<TouchEvent>>fromEvent(document, "touchstart", { passive: true })).pipe(
          filter(({ touches }) => touches.length === 1),
          map(({ touches }) => touches[0] as Coord)
        );

        const mousedown$ = !mouseEvents
          ? NEVER
          : (<Observable<MouseEvent>>fromEvent(document, "mousedown")).pipe(
            map((e) => (((e as Coord).event = e), e as Coord)),
          );

        return merge(touchstart$, mousedown$);
      })
    );
  }

  getMoveObservable(start$: Observable<Coord>, end$: Observable<Coord>) {
    return combineLatest([this.$.mouseEvents, this.$.preventDefault]).pipe(
      switchMap(([mouseEvents, preventDefault]) => {
        const touchmove$ = (<Observable<TouchEvent>>fromEvent(document, "touchmove", { passive: !preventDefault })).pipe(
          map(e => (((e.touches[0] as Coord).event = e), e.touches[0] as Coord))
        );

        const mousemove$ = !mouseEvents
          ? NEVER
          : (<Observable<MouseEvent>>fromEvent(document, "mousemove", { passive: !preventDefault })).pipe(
            subscribeWhen(merge(start$.pipe(mapTo(true)), end$.pipe(mapTo(false)))),
            map(e => (((e as Coord).event = e), e as Coord))
          );

        return merge(touchmove$, mousemove$);
      })
    );
  }

  getEndObservable() {
    return combineLatest([this.$.mouseEvents]).pipe(
      switchMap(([mouseEvents]) => {
        const touchend$ = (<Observable<TouchEvent>>fromEvent(document, "touchend", { passive: true })).pipe(
          filter(({ touches }) => touches.length === 0),
          map(event => event.changedTouches[0] as Coord)
        );

        const mouseup$ = !mouseEvents
          ? NEVER
          : (<Observable<MouseEvent>>fromEvent(document, "mouseup", { passive: true })).pipe(
            map(e => (((e as Coord).event = e), e as Coord)),
          );

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
          if (this.noScroll && isSliding && event) event.preventDefault();
          return isSliding;
        })
      );
    }
  }
}
