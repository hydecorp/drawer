export { applyMixins, subscribeWhen, filterWhen, tween } from '@hydecorp/component';
export declare function easeOutSine(t: number, b: number, c: number, d: number): number;
export declare function observeWidth(el: HTMLElement): import("rxjs").Observable<number>;
export declare const rangeConverter: {
    fromAttribute(attr?: string): number[];
    toAttribute(range?: number[]): string;
};
export declare function rangeHasChanged(curr: number[], prev?: number[]): boolean;
