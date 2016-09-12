/*
 * Adapted from Ratchet's sliders.js
 * http://goratchet.com/components#sliders
 *
 * Adapted from Brad Birdsall's Swipe
 * https://github.com/thebird/Swipe
 *
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
import componentCore from '../component/componentCore';

function getBrowserCapabilities() {
  const styles = window.getComputedStyle(document.documentElement, '');
  const pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
  return {
    prefix: `-${pre}-`,
    transform: `${pre[0].toUpperCase() + pre.substr(1)}Transform`,
  };
}

/**
  * @param t current time
  * @param b start value
  * @param c change in value
  * @param d duration
  * @returns {number}
  */
function linearTween(t, b, c, d) {
  return ((c * t) / d) + b;
}

function pageDist(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.pageX - p2.pageX, 2) +
    Math.pow(p1.pageY - p2.pageY, 2)
  );
}

const IDLE = 'IDLE';
const TOUCHING = 'TOUCHING';
const START_ANIMATING = 'START_ANIMATING';
const ANIMATING = 'ANIMATING';

// TODO: make configureable
const DURATION = 200;
const MAX_OPACITY = 0.67;
const VELOCITY_THRESHOLD = 0.33;
const VELOCITY_LINEAR_COMBINATION = 0.6;

const browerCapabilities = getBrowserCapabilities();
// const transformPrefix = browerCapabilities.prefix;
const transformProperty = browerCapabilities.transform;


const DEFAULTS = Object.freeze({
  menuOpen: false,
  disabled: false,
});

export default (SuperClass) => class extends componentCore(SuperClass) {
  initComponent(el, props) {
    super.initComponent(el, props);

    this.cacheDOMElements();
    this.resetProperties();
    this.bindCallbacks();

    if (!this.disabled) {
      this.enable();
      this.jumpTo(this.menuOpen);
    }
  }

  defaults() {
    return DEFAULTS;
  }

  cacheDOMElements() {
    this.layout = this.el.querySelector('.y-layout');
    this.backdrop = this.el.querySelector('.y-backdrop');
    this.sidebar = this.el.querySelector('.y-sidebar');
  }

  resetProperties() {
    // priviate variables
    // TODO: make inaccessible
    this.startX = 0;
    this.startY = 0;
    this.pageX = 0;
    this.pageY = 0;
    this.lastPageX = 0;
    this.lastPageY = 0;
    this.isScrolling = undefined;
    this.startedMoving = false;
    this.state = IDLE;
    this.velocity = 0;
    this.startTranslateX = 0;
    this.translateX = 0;
    this.animationFrameRequested = false;
    // this.lastTime = 0;
    // this.sliderWidth;
  }

  bindCallbacks() {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    // this.onMouseDown = this.onMouseDown.bind(this);
    // this.onMouseMove = this.onMouseMove.bind(this);
    // this.onMouseUp = this.onMouseUp.bind(this);

    this.onBackdropClick = this.onBackdropClick.bind(this);

    this.onAnimationFrame = this.onAnimationFrame.bind(this);
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.onTouchStart);
    // document.addEventListener('mousedown', this.onMouseDown);
    this.backdrop.addEventListener('click', this.onBackdropClick);
  }

  removeEventListeners() {
    document.removeEventListener('touchstart', this.onTouchStart);
    // document.addEventListener('mousedown', this.onMouseDown);
    this.backdrop.removeEventListener('click', this.onBackdropClick);
  }

  requestAnimationLoop() {
    if (!this.animationFrameRequested) {
      this.animationFrameRequested = true;
      requestAnimationFrame(this.onAnimationFrame);
    }
  }

  getNearestTouch(touches) {
    let nearestTouch = null;
    let minDist = Number.POSITIVE_INFINITY;

    for (const touch of touches) {
      const dist = pageDist(this, touch);
      if (dist < minDist) {
        minDist = dist;
        nearestTouch = touch;
      }
    }

    return nearestTouch;
  }

  // TODO: generic solution for disabling the slider
  // isCodeBlock(path) {
  //   for (let i = 0; i < path.length; i++) {
  //     const node = path[i];
  //     const classList = node.classList;
  //
  //     if (classList && (classList.contains('highlight') ||
  //                       classList.contains('katex-display'))
  //                   && node.scrollLeft > 0) {
  //       return true;
  //     }
  //   }
  //
  //   return false;
  // }

  // TODO: DRY
  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isScrolling = undefined;

      const touch = e.touches[0];
      this.startX = this.pageX = this.lastPageX = touch.pageX;
      this.startY = this.pageY = this.lastPageY = touch.pageY;

      if (this.menuOpen || (this.pageX < window.innerWidth / 3)) {
        this.prepInteraction();
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
      }
    }
  }

  // TODO: DRY
  // onMouseDown(e) {
  //   this.isScrolling = undefined;
  //
  //   this.startX = this.pageX = this.lastPageX = e.pageX;
  //   this.startY = this.pageY = this.lastPageY = e.pageY;
  //
  //   if (this.menuOpen || (this.pageX < window.innerWidth / 3)) {
  //     document.addEventListener('mousemove', this.onMouseMove);
  //     document.addEventListener('mouseup', this.onMouseUp);
  //   }
  // }

  // TODO: DRY
  onTouchMove(e) {
    const touch = this.getNearestTouch(e.touches);
    this.pageX = touch.pageX;
    this.pageY = touch.pageY;

    if (typeof this.isScrolling === 'undefined' && this.startedMoving) {
      this.isScrolling = Math.abs(this.startY - this.pageY) > Math.abs(this.startX - this.pageX);
      if (!this.isScrolling) {
        this.state = TOUCHING;
        this.requestAnimationLoop();
      }
    }

    if (this.isScrolling && !this.menuOpen) {
      return;
    }

    e.preventDefault();

    this.startedMoving = true;
  }

  // TODO: DRY
  // onMouseMove(e) {
  //   this.pageX = e.pageX;
  //   this.pageY = e.pageY;
  //
  //   if (typeof this.isScrolling === 'undefined' && this.startedMoving) {
  //     this.isScrolling =
  //       Math.abs(this.startY - this.pageY) > Math.abs(this.startX - this.pageX);
  //     if (!this.isScrolling) {
  //       this.state = TOUCHING;
  //       this.requestAnimationLoop();
  //     }
  //   }
  //
  //   if (this.isScrolling && !this.menuOpen) return;
  //
  //   this.startedMoving = true;
  // }

  updateMenuOpen() {
    if (this.velocity > VELOCITY_THRESHOLD) {
      this.menuOpen = true;
    } else if (this.velocity < -VELOCITY_THRESHOLD) {
      this.menuOpen = false;
    } else if (this.translateX >= this.sliderWidth / 2) {
      this.menuOpen = true;
    } else {
      this.menuOpen = false;
    }
  }

  // TODO: DRY
  onTouchEnd(e) {
    if (this.isScrolling || e.touches.length > 0) {
      return;
    }

    if (this.startedMoving) {
      this.updateMenuOpen();
    }

    this.state = START_ANIMATING;
    this.startedMoving = false;

    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }

  // TODO: DRY
  // onMouseUp() {
  //   if (this.isScrolling) {
  //     return;
  //   }
  //
  //   if (this.startedMoving) {
  //     this.updateMenuOpen();
  //   }
  //
  //   this.state = START_ANIMATING;
  //   this.startedMoving = false;
  //
  //   document.removeEventListener('mousemove', this.onMouseMove);
  //   document.removeEventListener('mouseup', this.onMouseUp);
  // }

  onBackdropClick() {
    this.close();
  }

  prepInteraction() {
    this.sidebar.style.willChange = 'transform';
    this.backdrop.style.willChange = 'opacity';
    this.sliderWidth = this.getMovableSliderWidth();
  }

  animateTo(menuOpen) {
    this.prepInteraction();
    this.menuOpen = menuOpen;
    this.state = START_ANIMATING;
    this.requestAnimationLoop();
  }

  // FIXME
  jumpTo(menuOpen) {
    this.state = IDLE;
    this.menuOpen = menuOpen;

    requestAnimationFrame(() => {
      this.sliderWidth = this.getMovableSliderWidth();
      this.startTranslateX = menuOpen * this.sliderWidth;
      this.endAnimating();
      this.updateDOM(this.startTranslateX, this.sliderWidth);
    });
  }

  /**
    * Since part of the slider could be always visible,
    * the width that is "movable" is less than the complete slider width.
    */
  getMovableSliderWidth() {
    return -this.sidebar.offsetLeft;
  }

  updateTranslateX() {
    const deltaX = this.pageX - this.startX;
    this.translateX = this.startTranslateX + deltaX;
    this.translateX = Math.max(0, Math.min(this.sliderWidth, this.translateX));
    return deltaX;
  }

  onAnimationFrame(time) {
    switch (this.state) {
      case TOUCHING: {
        this.onTouching(time);
        break;
      }

      case START_ANIMATING: {
        this.onStartAnimating(time);
        this.onAnimationFrame(time); // jump to next case block
        break;
      }

      case ANIMATING: {
        this.onAnimating(time);
        break;
      }

      default: {
        break;
      }
    }
  }

  onTouching(time) {
    const timeDiff = time - this.lastTime;

    if (timeDiff > 0) {
      const pageXDiff = this.pageX - this.lastPageX;
      this.velocity = (VELOCITY_LINEAR_COMBINATION * (pageXDiff / timeDiff)) +
                      ((1 - VELOCITY_LINEAR_COMBINATION) * this.velocity);
    }

    this.updateTranslateX();
    this.updateDOM(this.translateX, this.sliderWidth);

    this.lastTime = time;
    this.lastPageX = this.pageX;
    this.lastPageY = this.pageY;

    requestAnimationFrame(this.onAnimationFrame);
  }

  onStartAnimating(time) {
    this.updateTranslateX();

    // store all animation related data in this object,
    // delete after animation is completed
    const animation = {};
    animation.startX = this.translateX;
    animation.endX = (this.menuOpen ? 1 : 0) * this.sliderWidth;
    animation.changeInValue = animation.endX - animation.startX;
    animation.startTime = time;
    this.animation = animation;

    this.state = ANIMATING;
  }

  onAnimating(time) {
    const timeInAnimation = time - this.animation.startTime;

    if (timeInAnimation < DURATION) {
      this.onAnimatingCont(timeInAnimation);
    } else {
      this.onAnimatingEnd();
    }

    this.updateDOM(this.startTranslateX, this.sliderWidth);
  }

  onAnimatingCont(timeInAnimation) {
    const startValue = this.animation.startX;
    const changeInValue = this.animation.changeInValue;
    this.startTranslateX = linearTween(timeInAnimation, startValue, changeInValue, DURATION);
    requestAnimationFrame(this.onAnimationFrame);
  }

  onAnimatingEnd() {
    // end animation
    this.startTranslateX = this.animation.endX;
    delete this.animation;
    this.endAnimating();
  }

  endAnimating() {
    this.animationFrameRequested = false;
    this.velocity = 0;

    if (this.menuOpen) {
      this.layout.classList.add('y-open');
      // document.body.style.overflowY = 'hidden'
      // this.backdrop.style.pointerEvents = 'all';
    } else {
      this.layout.classList.remove('y-open');

      // only remove the styles when closing the sidebar,
      // since we eitehr expect a navigation (page reload)
      // or closing the sidebar again, ie more changes
      this.sidebar.style.willChange = '';
      this.backdrop.style.willChange = '';
      // document.body.style.overflowY = "";
      // this.backdrop.style.pointerEvents = 'none';
    }
  }

  updateDOM(translateX, sliderWidth) {
    this.sidebar.style[transformProperty] = `translate3d(${translateX}px,0,0)`;
    this.backdrop.style.opacity = MAX_OPACITY * (translateX / sliderWidth);
  }

  open() {
    if (!this.disabled) {
      this.animateTo(true);
    }
  }

  close() {
    if (!this.disabled) {
      this.animateTo(false);
    }
  }

  toggle() {
    if (this.menuOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  disable() {
    this.jumpTo(false);
    this.removeEventListeners();
    this.disabled = true;
  }

  enable() {
    this.jumpTo(this.menuOpen);
    this.addEventListeners();
    this.disabled = false;
  }
};
