import { combineLatest, fromEvent, merge, NEVER } from "rxjs";
import { 
// tap,
filter, map, mapTo, repeatWhen, skipWhile, startWith, switchMap, take, withLatestFrom, } from "rxjs/operators";
import { subscribeWhen } from "./common";
const abs = Math.abs.bind(Math);
export class ObservablesMixin {
    getStartObservable() {
        return combineLatest(this.$.mouseEvents).pipe(switchMap(([mouseEvents]) => {
            const touchstart$ = fromEvent(document, "touchstart", {
                passive: true,
            }).pipe(filter(({ touches }) => touches.length === 1), map(({ touches }) => touches[0]));
            const mousedown$ = !mouseEvents
                ? NEVER
                : fromEvent(document, "mousedown").pipe(map((e) => ((e.event = e), e)));
            return merge(touchstart$, mousedown$);
        }));
    }
    getMoveObservable(start$, end$) {
        return combineLatest(this.$.mouseEvents, this.$.preventDefault).pipe(switchMap(([mouseEvents, preventDefault]) => {
            const touchmove$ = fromEvent(document, "touchmove", {
                passive: !preventDefault
            }).pipe(map(e => ((e.touches[0].event = e), e.touches[0])));
            const mousemove$ = !mouseEvents
                ? NEVER
                : fromEvent(document, "mousemove", {
                    passive: !preventDefault,
                }).pipe(subscribeWhen(merge(start$.pipe(mapTo(true)), end$.pipe(mapTo(false)))), map(e => ((e.event = e), e)));
            return merge(touchmove$, mousemove$);
        }));
    }
    getEndObservable() {
        return combineLatest(this.$.mouseEvents).pipe(switchMap(([mouseEvents]) => {
            const touchend$ = fromEvent(document, "touchend", { passive: true }).pipe(filter(({ touches }) => touches.length === 0), map(event => event.changedTouches[0]));
            const mouseup$ = !mouseEvents
                ? NEVER
                : fromEvent(document, "mouseup", { passive: true });
            return merge(touchend$, mouseup$);
        }));
    }
    getIsSlidingObservable(move$, start$, end$) {
        return this.getIsSlidingObservableInner(move$, start$).pipe(take(1), startWith(undefined), repeatWhen(() => end$));
    }
    getIsSlidingObservableInner(move$, start$) {
        if (this.threshold) {
            return move$.pipe(withLatestFrom(start$), skipWhile(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) => abs(startY - clientY) < this.threshold && abs(startX - clientX) < this.threshold), map(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) => abs(startX - clientX) >= abs(startY - clientY)));
        }
        else {
            return move$.pipe(withLatestFrom(start$), map(([{ clientX, clientY, event }, { clientX: startX, clientY: startY }]) => {
                const isSliding = abs(startX - clientX) >= abs(startY - clientY);
                if (this.noScroll && isSliding)
                    event.preventDefault();
                return isSliding;
            }));
        }
    }
}
