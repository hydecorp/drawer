import { Observable, NEVER, PartialObserver } from "rxjs";

import { filter, map, switchMap, withLatestFrom } from "rxjs/operators";

export function easeOutSine(t: number, b: number, c: number, d: number) {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}

export function applyMixins(...baseCtors: Constructor<any>[]) {
  return <T>(derivedCtor: Constructor<T>) => {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
    return derivedCtor;
  }
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

export const arrayConverter = {
  fromAttribute(attr) {
    if (attr == null) return null;

    const str = attr
      .trim()
      .replace(/^\[?(.*?)\]?$/, "$1")
      .split(",")
      .map(x => x.trim());

    return str || null;
  },

  toAttribute(a) {
    return a && a.length > 0 ? a.join(",") : null;
  },
}

export const numberConverter = {
  fromAttribute(attr) { return Number(attr) },
  toAttribute(x) { return x.toString() },
}

export const arrayOfConverter = (converter) => ({
  formAttribute(attr) {
    if (attr == null) return null;
    const a = arrayConverter.fromAttribute(attr).map(converter.fromAttribute);
    if (a.every((x) => !!x)) {
      return a;
    }
    return null;
  },

  toAttribute(a) {
    const a2 = a && a.map && a.map(converter.toAttribute);
    if (a2 && a2.every((x) => x !== null)) {
      return arrayConverter.toAttribute(a2);
    }
    return null;
  },
})
