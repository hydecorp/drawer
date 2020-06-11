import { of } from "rxjs";
import { map } from "rxjs/operators";
import { createResizeObservable } from '@hydecorp/component';

export { applyMixins, subscribeWhen, filterWhen, tween } from '@hydecorp/component';

export function easeOutSine(t: number, b: number, c: number, d: number) {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
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
