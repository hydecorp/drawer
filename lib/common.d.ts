import { Observable } from "rxjs";
export declare function easeOutSine(t: number, b: number, c: number, d: number): number;
export declare function applyMixins<T>(derivedCtor: Constructor<T>, baseCtors: Constructor<any>[]): Constructor<T>;
export declare function subscribeWhen<T>(p$: Observable<boolean>): (source: Observable<T>) => Observable<T>;
export declare function filterWhen<T>(p$: Observable<boolean>, ...others: Observable<boolean>[]): (source: Observable<T>) => Observable<T>;
export declare function createResizeObservable(el: HTMLElement): Observable<ResizeObserverEntry>;
export declare function observeWidth(el: HTMLElement): Observable<number>;
export declare const rangeConverter: {
    fromAttribute(attr?: string): number[];
    toAttribute(range?: number[]): string;
};
export declare function rangeHasChanged(curr: number[], prev?: number[]): boolean;
