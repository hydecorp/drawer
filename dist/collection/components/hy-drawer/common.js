import { Observable, NEVER } from "rxjs";
import { filter, map, switchMap, withLatestFrom } from "rxjs/operators";
export function easeOutSine(t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}
export function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
export function subscribeWhen(p$) {
    return (source) => {
        return p$.pipe(switchMap(p => (p ? source : NEVER)));
    };
}
export function filterWhen(p$, ...others) {
    return (source) => {
        if (others.length === 0) {
            return source.pipe(withLatestFrom(p$), filter(([, p]) => p), map(([x]) => x));
        }
        return source.pipe(withLatestFrom(p$, ...others), filter(([, ...ps]) => ps.every(p => p)), map(([x]) => x));
    };
}
;
export function createResizeObservable(el) {
    return Observable.create((obs) => {
        const observer = new window.ResizeObserver(xs => xs.forEach(x => obs.next(x)));
        observer.observe(el);
        return () => { observer.unobserve(el); };
    });
}
