import { ComplexAttributeConverter } from "lit-element";
export { applyMixins, subscribeWhen, filterWhen, tween } from '@hydecorp/component';
export declare function easeOutSine(t: number, b: number, c: number, d: number): number;
export declare function observeWidth(el: HTMLElement): import("rxjs").Observable<number>;
export declare const rangeConverter: ComplexAttributeConverter<number[]>;
export declare function rangeHasChanged(curr: number[], prev?: number[]): boolean;
//# sourceMappingURL=common.d.ts.map