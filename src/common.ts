import { Observable, of, NEVER, PartialObserver, animationFrames } from "rxjs";

import { filter, map, switchMap, withLatestFrom, takeWhile, endWith, tap } from "rxjs/operators";

export function easeOutSine(t: number, b: number, c: number, d: number) {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}

export function applyMixins<T>(derivedCtor: Constructor<T>, baseCtors: Constructor<any>[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
  return derivedCtor;
}

export function subscribeWhen<T>(p$: Observable<boolean>) {
  return (source: Observable<T>) => {
    return p$.pipe(switchMap(p => (p ? source : NEVER)));
  };
}

export function filterWhen<T>(p$: Observable<boolean>, ...others: Observable<boolean>[]) {
  return (source: Observable<T>) => {
    if (others.length === 0) {
      return source.pipe(
        withLatestFrom(p$),
        filter(([, p]) => p),
        map(([x]) => x)
      );
    }

    return source.pipe(
      withLatestFrom(p$, ...others),
      filter(([, ...ps]) => ps.every(p => p)),
      map(([x]) => x as T)
    );
  };
};

export function createResizeObservable(el: HTMLElement): Observable<ResizeObserverEntry> {
  return Observable.create((obs: PartialObserver<ResizeObserverEntry>) => {
    const observer = new window.ResizeObserver(xs => xs.forEach(x => obs.next(x)));
    observer.observe(el);
    return () => { observer.unobserve(el); };
  });
}

export function observeWidth(el: HTMLElement) {
  // This component should have at least basic support without `ResizeObserver` support,
  // so we pass a one-time measurement when it's missing. Obviously this won't update, so BYO polyfill.
  const resize$ = "ResizeObserver" in window
    ? createResizeObservable(el)
    : of({ contentRect: { width: el.clientWidth }});
  return resize$.pipe(map(({ contentRect: { width } }) => width));
}

export const rangeConverter = {
  fromAttribute(attr: string = '') {
    return attr
      .replace(/[\[\]]/g, '')
      .split(",")
      .map(Number);
  },

  toAttribute(range: number[] = []) {
    return range.join(',');
  },
}

export function rangeHasChanged(curr: number[], prev: number[] = []) {
  return curr.length !== prev.length || curr.some((v, i) => v !== prev[i]);
}

export function tween(easingFn: (t: number, b: number, c: number, d: number, s?: number) => number, b: number, c: number, d: number, s?: number): Observable<number> {
  return animationFrames().pipe(
    takeWhile(t => t < d),
    endWith(d),
    map(t => easingFn(t, b, c, d, s)),
  )
}
