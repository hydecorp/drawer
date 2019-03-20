import { VELOCITY_THRESHOLD } from "./constants";

import { Coord } from './observables';

// Using shorthands for common functions
const min = Math.min.bind(Math);
const max = Math.max.bind(Math);

export class CalcMixin {
  align: 'left' | 'right';
  range: [number, number];

  calcIsInRange({ clientX }: Coord, opened: boolean) {
    // console.log(this.range, this.align);
    switch (this.align) {
      case "left": {
        const [lower, upper] = this.range;
        return clientX > lower && (opened || clientX < upper);
      }
      case "right": {
        const upper = window.innerWidth - this.range[0];
        const lower = window.innerWidth - this.range[1];
        return clientX < upper && (opened || clientX > lower);
      }
      default:
        throw Error();
    }
  }

  calcIsSwipe({ clientX: startX }: Coord, { clientX: endX }: Coord, translateX: number, drawerWidth: number, _: number): boolean {
    return endX !== startX || (translateX > 0 && translateX < drawerWidth);
  }

  calcWillOpen(_: {}, __: {}, translateX: number, drawerWidth: number, velocity: number): boolean {
    switch (this.align) {
      case "left": {
        if (velocity > VELOCITY_THRESHOLD) return true;
        else if (velocity < -VELOCITY_THRESHOLD) return false;
        else if (translateX >= drawerWidth / 2) return true;
        else return false;
      }
      case "right": {
        if (-velocity > VELOCITY_THRESHOLD) return true;
        else if (-velocity < -VELOCITY_THRESHOLD) return false;
        else if (translateX <= -drawerWidth / 2) return true;
        else return false;
      }
      default:
        throw Error();
    }
  }

  calcTranslateX({ clientX: moveX }: Coord, { clientX: startX }: Coord, startTranslateX: number, drawerWidth: number): number {
    switch (this.align) {
      case "left": {
        const deltaX = moveX - startX;
        const translateX = startTranslateX + deltaX;
        return max(0, min(drawerWidth, translateX));
      }
      case "right": {
        const deltaX = moveX - startX;
        const translateX = startTranslateX + deltaX;
        return min(0, max(-drawerWidth, translateX));
      }
      default:
        throw Error();
    }
  }
};