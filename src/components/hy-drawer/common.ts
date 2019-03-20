import { Observable, NEVER, PartialObserver } from "rxjs";

import { filter, map, switchMap, withLatestFrom } from "rxjs/operators";

export function easeOutSine(t: number, b: number, c: number, d: number) {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
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
    const observer = new window.ResizeObserver(xs => Array.from(xs).forEach(x => obs.next(x)));
    observer.observe(el);
    return () => { observer.unobserve(el); };
  });
}