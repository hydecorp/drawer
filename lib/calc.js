import { VELOCITY_THRESHOLD } from "./constants";
// Using shorthands for common functions
const min = Math.min.bind(Math);
const max = Math.max.bind(Math);
export class CalcMixin {
    calcIsInRange({ clientX }, opened) {
        // console.log(this.range, this.align);
        switch (this.side) {
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
    calcIsSwipe({ clientX: startX }, { clientX: endX }, translateX, drawerWidth, _) {
        return endX !== startX || (translateX > 0 && translateX < drawerWidth);
    }
    calcWillOpen(_, __, translateX, drawerWidth, velocity) {
        switch (this.side) {
            case "left": {
                if (velocity > VELOCITY_THRESHOLD)
                    return true;
                else if (velocity < -VELOCITY_THRESHOLD)
                    return false;
                else if (translateX >= drawerWidth / 2)
                    return true;
                else
                    return false;
            }
            case "right": {
                if (-velocity > VELOCITY_THRESHOLD)
                    return true;
                else if (-velocity < -VELOCITY_THRESHOLD)
                    return false;
                else if (translateX <= -drawerWidth / 2)
                    return true;
                else
                    return false;
            }
            default:
                throw Error();
        }
    }
    calcTranslateX({ clientX: moveX }, { clientX: startX }, startTranslateX, drawerWidth) {
        switch (this.side) {
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
}
;
