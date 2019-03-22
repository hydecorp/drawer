import { Observable } from "rxjs";
export declare function easeOutSine(t: number, b: number, c: number, d: number): number;
export declare function applyMixins(derivedCtor: any, baseCtors: any[]): void;
export declare function subscribeWhen<T>(p$: Observable<boolean>): (source: Observable<T>) => Observable<T>;
export declare function filterWhen<T>(p$: Observable<boolean>, ...others: Observable<boolean>[]): (source: Observable<T>) => Observable<T>;
export declare function createResizeObservable(el: HTMLElement): Observable<ResizeObserverEntry>;
