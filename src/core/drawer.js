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
/* eslint-disable no-unresolved */
import componentCore from 'vanilla-component/src/componentCore';

import { getBrowserCapabilities, linearTween, pageDist } from '../common';

const IDLE = 'IDLE';
const TOUCHING = 'TOUCHING';
const START_ANIMATING = 'START_ANIMATING';
const ANIMATING = 'ANIMATING';

const VELOCITY_THRESHOLD = 0.2;
const VELOCITY_LINEAR_COMBINATION = 0.8;

const browerCapabilities = getBrowserCapabilities();
// const transformPrefix = browerCapabilities.prefix;
const transformProperty = browerCapabilities.transform;

// ~ mixin drawerCore with componentCore { ...
export default (C) => class extends componentCore(C) {

  // @override
  initComponent(el, props) {
    super.initComponent(el, props);

    this.cacheDOMElements();
    this.resetProperties();
    this.bindCallbacks();

    if (!this.disabled) {
      this.enable();
      this.jumpTo(this.state.menuOpen);
    }
  }

  cacheDOMElements() {
    this.layout = this.el.querySelector('.y-layout');
    this.backdrop = this.el.querySelector('.y-backdrop');
    this.drawer = this.el.querySelector('.y-drawer');
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
    this.loopState = IDLE;
    this.velocity = 0;
    this.startTranslateX = 0;
    this.translateX = 0;
    this.animationFrameRequested = false;
    this.touching = false;
    // this.lastTime = 0;
    // this.sliderWidth;
  }

  bindCallbacks() {
    this.touchStartCallback = this.touchStartCallback.bind(this);
    this.touchMoveCallback = this.touchMoveCallback.bind(this);
    this.touchEndCallback = this.touchEndCallback.bind(this);
    this.backdropClickCallback = this.backdropClickCallback.bind(this);
    this.animationFrameCallback = this.animationFrameCallback.bind(this);
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.touchStartCallback, { passive: false });
    document.addEventListener('touchmove', this.touchMoveCallback, { passive: false });
    document.addEventListener('touchend', this.touchEndCallback, { passive: false });

    this.backdrop.addEventListener('click', this.backdropClickCallback);
  }

  removeEventListeners() {
    document.removeEventListener('touchstart', this.touchStartCallback, { passive: false });
    document.removeEventListener('touchmove', this.touchMoveCallback, { passive: false });
    document.removeEventListener('touchend', this.touchEndCallback, { passive: false });

    this.backdrop.removeEventListener('click', this.backdropClickCallback);
  }

  requestAnimationLoop() {
    if (!this.animationFrameRequested) {
      this.animationFrameRequested = true;
      requestAnimationFrame(this.animationFrameCallback);
    }
  }

  getNearestTouch(touches) {
    if (touches.length === 1) return touches[0];
    return Array.prototype.reduce.call(touches, (acc, touch) => {
      const dist = pageDist(this, touch);
      return (dist < acc.dist) ? {
        dist,
        touch,
      } : acc;
    }, {
      dist: Number.POSITIVE_INFINITY,
      touch: null,
    }).touch;
  }

  touchStartCallback(e) {
    if (e.touches.length === 1) {
      this.isScrolling = undefined;

      const touch = e.touches[0];
      this.startX = this.pageX = this.lastPageX = touch.pageX;
      this.startY = this.pageY = this.lastPageY = touch.pageY;

      if (this.state.menuOpen || (this.pageX < window.innerWidth / 3)) {
        this.prepInteraction();
        this.touching = true;
        this.loopState = TOUCHING;
      }
    }
  }

  touchMoveCallback(e) {
    if (this.touching) {
      const touch = this.getNearestTouch(e.touches);
      this.pageX = touch.pageX;
      this.pageY = touch.pageY;

      if (typeof this.isScrolling === 'undefined' && this.startedMoving) {
        this.isScrolling = Math.abs(this.startY - this.pageY) > Math.abs(this.startX - this.pageX);
        if (!this.isScrolling) {
          this.loopState = TOUCHING;
          this.requestAnimationLoop();
        }
      }

      if (this.isScrolling) {
        return;
      }

      e.preventDefault();

      this.startedMoving = true;
    }
  }

  updateMenuOpen() {
    if (this.velocity > VELOCITY_THRESHOLD) {
      // this.menuOpen = true;
      this.setState('menuOpen', true);
    } else if (this.velocity < -VELOCITY_THRESHOLD) {
      // this.menuOpen = false;
      this.setState('menuOpen', false);
    } else if (this.translateX >= this.sliderWidth / 2) {
      // this.menuOpen = true;
      this.setState('menuOpen', true);
    } else {
      // this.menuOpen = false;
      this.setState('menuOpen', false);
    }
  }

  touchEndCallback(e) {
    if (this.touching) {
      if (this.isScrolling || e.touches.length > 0) {
        return;
      }

      if (this.startedMoving) {
        this.updateMenuOpen();
      }

      if (this.state.menuOpen) {
        // this.layout.classList.add('y-open');
        this.backdrop.style.pointerEvents = 'all';
      } else {
        // this.layout.classList.remove('y-open');
        this.backdrop.style.pointerEvents = '';
      }

      this.loopState = START_ANIMATING;
      this.startedMoving = false;
      this.touching = false;
    }
  }

  backdropClickCallback() {
    this.close();
  }

  prepInteraction() {
    // document.body.style.overflowY = 'hidden';
    this.drawer.style.willChange = 'transform';
    this.backdrop.style.willChange = 'opacity';
    this.sliderWidth = this.getMovableSliderWidth();
  }

  animateTo(menuOpen) {
    this.prepInteraction();
    // this.menuOpen = menuOpen;
    this.setState('menuOpen', menuOpen);
    this.loopState = START_ANIMATING;
    this.requestAnimationLoop();
  }

  jumpTo(menuOpen) {
    this.loopState = IDLE;
    // this.menuOpen = menuOpen;
    this.setState('menuOpen', menuOpen);

    requestAnimationFrame(() => {
      this.sliderWidth = this.getMovableSliderWidth();
      this.startTranslateX = menuOpen * this.sliderWidth;
      this.endAnimating();
      this.updateDOM(this.startTranslateX, this.sliderWidth);
    });
  }

  // Since part of the slider could be visible,
  // the width that is "movable" is less than the complete slider width
  // and given by
  getMovableSliderWidth() {
    return -this.drawer.offsetLeft;
  }

  updateTranslateX() {
    const deltaX = this.pageX - this.startX;
    this.translateX = this.startTranslateX + deltaX;
    this.translateX = Math.max(0, Math.min(this.sliderWidth, this.translateX));
    return deltaX;
  }

  animationFrameCallback(time) {
    switch (this.loopState) {
      case TOUCHING: {
        this.touchingFrame(time);
        break;
      }

      case START_ANIMATING: {
        this.startAnimatingFrame(time);
        this.animationFrameCallback(time); // jump to next case block
        break;
      }

      case ANIMATING: {
        this.animatingFrame(time);
        break;
      }

      default: {
        break;
      }
    }
  }

  touchingFrame(time) {
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

    requestAnimationFrame(this.animationFrameCallback);
  }

  startAnimatingFrame(time) {
    this.updateTranslateX();

    // store all animation related data in this object,
    // delete after animation is completed
    const animation = {};
    animation.startX = this.translateX;
    animation.endX = (this.state.menuOpen ? 1 : 0) * this.sliderWidth;
    animation.changeInValue = animation.endX - animation.startX;
    animation.startTime = time;
    this.animation = animation;

    this.loopState = ANIMATING;
  }

  animatingFrame(time) {
    const timeInAnimation = time - this.animation.startTime;

    if (timeInAnimation < this.duration) {
      this.animatingCont(timeInAnimation);
    } else {
      this.animatingEnd();
    }

    this.updateDOM(this.startTranslateX, this.sliderWidth);
  }

  animatingCont(timeInAnimation) {
    const startValue = this.animation.startX;
    const changeInValue = this.animation.changeInValue;
    this.startTranslateX = linearTween(timeInAnimation, startValue, changeInValue, this.duration);
    requestAnimationFrame(this.animationFrameCallback);
  }

  animatingEnd() {
    // end animation
    this.startTranslateX = this.animation.endX;
    delete this.animation;
    this.endAnimating();
  }

  endAnimating() {
    this.animationFrameRequested = false;
    this.velocity = 0;

    if (this.state.menuOpen) {
      // document.body.style.overflowY = 'hidden';
      this.backdrop.style.pointerEvents = 'all';
    } else {
      // document.body.style.overflowY = '';
      this.backdrop.style.pointerEvents = '';

      // only remove the styles when closing the drawer,
      // since we eitehr expect a navigation (page reload)
      // or closing the drawer again, ie more changes
      this.drawer.style.willChange = '';
      this.backdrop.style.willChange = '';
    }
  }

  updateDOM(translateX, sliderWidth) {
    this.drawer.style[transformProperty] = `translate3d(${translateX}px,0,0)`;
    this.backdrop.style.opacity = this.maxOpacity * (translateX / sliderWidth);
  }

  // @override
  defaults() {
    return {
      menuOpen: false,
      disabled: false,
      duration: 200,
      maxOpacity: 0.67,
    };
  }

  // @override
  hooks() {
    return {
      menuOpen: (mO) => {
        if (mO === true) {
          this.open();
        } else {
          this.close();
        }
      },
      disabled: (d) => {
        if (d === true) {
          this.disable();
        } else {
          this.enable();
        }
      },
    };
  }

  open() {
    if (!this.state.disabled) {
      this.animateTo(true);
    }
  }

  close() {
    if (!this.state.disabled) {
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
    // this.disabled = true;
    this.setState('disabled', true);
  }

  enable() {
    this.jumpTo(this.state.menuOpen);
    this.addEventListeners();
    // this.disabled = false;
    this.setState('disabled', false);
  }
};
