/*
 * Adapted from Ratchet's sliders.js
 * http://goratchet.com/components#sliders
 *
 * Adapted from Brad Birdsall's Swipe
 * https://github.com/thebird/Swipe
 *
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT (https://github.com/qwtel/y-sidebar)
 */

/*
 * Just return a value to define the module export.
 * This example returns an object, but the module
 * can return a function as the exported value.
 */
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

// TODO: don't ployfill as part of the component
// polyfillRequestAnimationFrame();

// TODO: tap component!?
// new Tap(backdrop);
// new Tap(menu);

export default class SidebarCore {
  constructor(el) {
    this.el = this.setupDOM(el);
    this.cacheDOMElements();
    this.resetProperties();
    this.bindCallbacks();
    this.addEventListeners();
    this.onResize();
  }

  setupDOM(el) {
    return el;
  }

  cacheDOMElements() {
    this.layout = this.el.querySelector('.y-layout');
    this.backdrop = this.el.querySelector('.y-backdrop');
    this.sidebar = this.el.querySelector('.y-sidebar');
  }

  resetProperties() {
    this.startX = 0;
    this.startY = 0;
    this.pageX = 0;
    this.pageY = 0;
    this.lastPageX = 0;
    this.lastPageY = 0;
    this.isScrolling = undefined;
    this.startedMoving = false;
    this.state = IDLE;
    this.menuOpen = 0;
    this.velocity = 0;
    this.startTranslateX = 0;
    this.translateX = 0;
    this.animationFrameRequested = false;

    // this.animationStartTime;
    // this.animationStartX;
    // this.animationEndX;
    // this.animationChangeInValue;
    // this.lastTime;
    // this.timeDiff;

    // this.sliderWidth;
    // this.screenWidth;
  }

  bindCallbacks() {
    // TODO: property initializers?
    this.onResize = this.onResize.bind(this);

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

    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
  }

  requestAnimationLoop() {
    if (!this.animationFrameRequested) {
      this.animationFrameRequested = true;
      requestAnimationFrame(this.onAnimationFrame);
    }
  }

  distanceToLastTouch(p) {
    return Math.sqrt(
      Math.pow(this.pageX - p.pageX, 2) +
      Math.pow(this.pageY - p.pageY, 2)
    );
  }

  getNearestTouch(touches) {
    return Array.prototype.reduce.call(touches, (acc, touch) => {
      const dist = this.distanceToLastTouch(touch);
      return (dist < acc.dist) ? { dist, touch } : acc;
    }, {
      dist: Number.POSITIVE_INFINITY,
      touch: null,
    }).touch;
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
        document.addEventListener('touchmove', this.onTouchMove, { passive: true });
        document.addEventListener('touchend', this.onTouchEnd, { passive: true });
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
  //     document.addEventListener('mousemove', this.onMouseMove, { passive: true });
  //     document.addEventListener('mouseup', this.onMouseUp, { passive: true });
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

    if (this.isScrolling && !this.menuOpen) return;

    this.startedMoving = true;
  }

  // TODO: DRY
  // onMouseMove(e) {
  //   this.pageX = e.pageX;
  //   this.pageY = e.pageY;
  //
  //   if (typeof this.isScrolling === 'undefined' && this.startedMoving) {
  //     this.isScrolling = Math.abs(this.startY - this.pageY) > Math.abs(this.startX - this.pageX);
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
      this.menuOpen = 1;
    } else if (this.velocity < -VELOCITY_THRESHOLD) {
      this.menuOpen = 0;
    } else if (this.translateX >= this.sliderWidth) {
      this.menuOpen = 1;
    } else {
      this.menuOpen = 0;
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

  onBackdropClick(e) {
    e.preventDefault();
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
    this.sliderWidth = this.getMovableSliderWidth();
    this.startTranslateX = menuOpen * this.sliderWidth;
    this.updateDOM(this.startTranslateX, this.sliderWidth);
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
      this.velocity = ((VELOCITY_LINEAR_COMBINATION * pageXDiff) / timeDiff) +
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

    this.animationStartX = this.translateX;
    this.animationEndX = this.menuOpen * this.sliderWidth;
    this.animationChangeInValue = this.animationEndX - this.animationStartX;
    this.animationStartTime = time;

    this.state = ANIMATING;
  }

  onAnimating(time) {
    const timeInAnimation = time - this.animationStartTime;

    if (timeInAnimation < DURATION) {
      this.onAnimatingCont(timeInAnimation);
    } else {
      this.onAnimatingEnd();
    }

    this.updateDOM(this.startTranslateX, this.sliderWidth);
  }

  onAnimatingCont(timeInAnimation) {
    const startValue = this.animationStartX;
    const changeInValue = this.animationChangeInValue;
    this.startTranslateX = linearTween(timeInAnimation, startValue, changeInValue, DURATION);
    requestAnimationFrame(this.onAnimationFrame);
  }

  onAnimatingEnd() {
    // end animation
    this.startTranslateX = this.animationEndX;
    this.animationFrameRequested = false;
    this.velocity = 0;

    if (this.menuOpen === 1) {
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

  enableSlider() {
    this.layout.classList.add('y-active');
    // this._jumpTo(0);
  }

  disableSlider() {
    this.layout.classList.remove('y-active');
    // this._jumpTo(1);
  }

  onResize() {
    if (window.matchMedia('(min-width: 48em)').matches) {
      this.disableSlider();
    } else {
      this.enableSlider();
    }
  }

  open(opts) {
    const options = Object.assign({ animate: true }, opts);
    if (options.animate) {
      this.animateTo(1);
    } else {
      this.jumpTo(1);
    }
  }

  close(opts) {
    const options = Object.assign({ animate: true }, opts);
    if (options.animate) {
      this.animateTo(0);
    } else {
      this.jumpTo(0);
    }
  }

  toggle(opts) {
    if (this.menuOpen === 1) {
      this.close(opts);
    } else {
      this.open(opts);
    }
  }
}
