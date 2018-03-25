// # src / mixin / calc.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { VELOCITY_THRESHOLD } from "./constants";

// Using shorthands for common functions
const min = Math.min.bind(Math);
const max = Math.max.bind(Math);

export const calcMixin = C =>
  class extends C {
    // #### Is in range?
    // Given a x-coordinate, `isInRange` will  determine whether it is within range from where
    // to pull the drawer. The x-coordinate *must* be larger than the lower bound,
    // but when the drawer is opened it may be anywhere on the screen.
    // Otherwise it must be below the upper bound.
    calcIsInRange(clientX, opened) {
      switch (this.align) {
        case "left":
          return clientX > this.range[0] && (opened || clientX < this.range[1]);
        case "right":
          return (
            clientX < window.innerWidth - this.range[0] &&
            (opened || clientX > window.innerWidth - this.range[1])
          );
        default:
          throw Error();
      }
    }

    // #### Calculate 'Is swipe?'
    // If the start and end position are not the same x-coordinate, we call it a 'swipe'.
    // However, if a tap occures during an animation (i.e. `translateX` not in a resting position)
    // we treat it as a swipe as well. The reasons for this are pretty complex:
    // Basically, we want users the be able to stop the animation by putting a finger on the screen.
    // However, if they lift the finger again without swiping, the animation would not continue,
    // because it would not pass the condition below, unless we introduce the second term.
    // TODO: reuse isSlidign observable?
    calcIsSwipe([{ clientX: endX }, { clientX: startX }, translateX]) {
      return endX !== startX || (translateX > 0 && translateX < this.drawerWidth);
    }

    // #### Calculate 'Will open?'
    // Based on current velocity and position of the drawer,
    // should the drawer slide open, or snap back?
    // TODO: could incorporate the current open state of the drawer.
    calcWillOpen([, , translateX, velocity]) {
      switch (this.align) {
        case "left": {
          if (velocity > VELOCITY_THRESHOLD) return true;
          else if (velocity < -VELOCITY_THRESHOLD) return false;
          else if (translateX >= this.drawerWidth / 2) return true;
          else return false;
        }
        case "right": {
          if (-velocity > VELOCITY_THRESHOLD) return true;
          else if (-velocity < -VELOCITY_THRESHOLD) return false;
          else if (translateX <= -this.drawerWidth / 2) return true;
          else return false;
        }
        default:
          throw Error();
      }
    }

    // #### Calculate translate X
    // Calcuate the current position of the drawer,
    // by taking the difference between the current and starting postion of the finger,
    // then adding that difference to the starting position of the drawer.
    // This way, we avoid the drawer jumping to the finger, when "catching" it during an animation.
    // The function will also clip the position at 0 and the width of the drawer.
    calcTranslateX(clientX, startX, startTranslateX) {
      switch (this.align) {
        case "left": {
          const deltaX = clientX - startX;
          const translateX = startTranslateX + deltaX;
          return max(0, min(this.drawerWidth, translateX));
        }
        case "right": {
          const deltaX = clientX - startX;
          const translateX = startTranslateX + deltaX;
          return min(0, max(-this.drawerWidth, translateX));
        }
        default:
          throw Error();
      }
    }

    // #### Get movable drawer width
    // One feature of hy-drawer is to allow the drawer to "peek" over the edge.
    // This effect is achieved by setting a smaller negative `left` (`right`) CSS property,
    // than is the width of the drawer,
    // The 'moveable' part of the drawer, then, is equal to that the inverse of that property.
    // See [Styling](../../styling.md) for more.
    calcMovableDrawerWidth() {
      return -parseFloat(getComputedStyle(this.contentEl)[this.align]);
    }
  };
