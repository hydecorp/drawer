import { Observable, of, NEVER } from "rxjs";
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
    return derivedCtor;
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
export function observeWidth(el) {
    // This component should have at least basic support without `ResizeObserver` support,
    // so we pass a one-time measurement when it's missing. Obviously this won't update, so BYO polyfill.
    const resize$ = "ResizeObserver" in window
        ? createResizeObservable(el)
        : of({ contentRect: { width: el.clientWidth } });
    return resize$.pipe(map(({ contentRect: { width } }) => width));
}
export const rangeConverter = {
    fromAttribute(attr = '') {
        return attr
            .replace(/[\[\]]/g, '')
            .split(",")
            .map(Number);
    },
    toAttribute(range = []) {
        return range.join(',');
    },
};
export function rangeHasChanged(curr, prev = []) {
    return curr.length !== prev.length || curr.some((v, i) => v !== prev[i]);
}
