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
import componentCore from 'y-component/src/componentCore';

import { linearTween, pageDist } from '../common';

const IDLE = 'IDLE';
const TOUCHING = 'TOUCHING';
const START_ANIMATING = 'START_ANIMATING';
const ANIMATING = 'ANIMATING';

const VELOCITY_THRESHOLD = 0.2;
const VELOCITY_LINEAR_COMBINATION = 0.8;

// ~ mixin drawerCore with componentCore { ...
export default (C) => class extends componentCore(C) {

  // @override
  initComponent(el, props) {
    super.initComponent(el, props);

    this.cacheDOMElements();
    this.resetProperties();
    this.bindCallbacks();

    this.jumpTo(this.opened);
    if (!this.persistent) this.addEventListeners();
    if (this.persistent) this.scrim.style.display = 'none';
  }

  cacheDOMElements() {
    this.scrim = this.el.querySelector('.y-drawer-scrim');
    this.content = this.el.querySelector('.y-drawer-content');
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
    this.lastTime = undefined;
    this.sliderWidth = undefined;
  }

  bindCallbacks() {
    this.touchStartCallback = this.touchStartCallback.bind(this);
    this.touchMoveCallback = this.touchMoveCallback.bind(this);
    this.touchEndCallback = this.touchEndCallback.bind(this);
    this.scrimClickCallback = this.scrimClickCallback.bind(this);
    this.animationFrameCallback = this.animationFrameCallback.bind(this);
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.touchStartCallback, { passive: false });
    document.addEventListener('touchmove', this.touchMoveCallback, { passive: false });
    document.addEventListener('touchend', this.touchEndCallback, { passive: false });

    this.scrim.addEventListener('click', this.scrimClickCallback);
  }

  removeEventListeners() {
    document.removeEventListener('touchstart', this.touchStartCallback, { passive: false });
    document.removeEventListener('touchmove', this.touchMoveCallback, { passive: false });
    document.removeEventListener('touchend', this.touchEndCallback, { passive: false });

    this.scrim.removeEventListener('click', this.scrimClickCallback);
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

      if (this.opened || (this.pageX < window.innerWidth / 3)) {
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
      this.setState('opened', true);
    } else if (this.velocity < -VELOCITY_THRESHOLD) {
      this.setState('opened', false);
    } else if (this.translateX >= this.sliderWidth / 2) {
      this.setState('opened', true);
    } else {
      this.setState('opened', false);
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

      if (this.opened) {
        this.scrim.style.pointerEvents = 'all';
      } else {
        this.scrim.style.pointerEvents = '';
      }

      this.loopState = START_ANIMATING;
      this.startedMoving = false;
      this.touching = false;
    }
  }

  scrimClickCallback() {
    this.close();
  }

  prepInteraction() {
    this.content.style.willChange = 'transform';
    this.scrim.style.willChange = 'opacity';
    this.content.classList.remove('y-drawer-opened');
    this.sliderWidth = this.getMovableSliderWidth();
  }

  animateTo(opened) {
    this.prepInteraction();
    this.setState('opened', opened);
    this.loopState = START_ANIMATING;
    this.requestAnimationLoop();
  }

  jumpTo(opened) {
    this.prepInteraction();
    this.setState('opened', opened);
    this.loopState = IDLE;
    requestAnimationFrame(() => {
      this.startTranslateX = opened * this.sliderWidth;
      this.endAnimating();
      this.updateDOM(this.startTranslateX, this.sliderWidth);
    });
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
        this.loopState = ANIMATING;
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
    animation.endX = (this.opened ? 1 : 0) * this.sliderWidth;
    animation.changeInValue = animation.endX - animation.startX;
    animation.startTime = time;
    this.animation = animation;
  }

  animatingFrame(time) {
    const timeInAnimation = time - this.animation.startTime;

    if (timeInAnimation < this.transitionDuration) {
      this.animatingCont(timeInAnimation);
    } else {
      this.animatingEnd();
    }
    // asdf

    this.updateDOM(this.startTranslateX, this.sliderWidth);
  }

  animatingCont(timeInAnimation) {
    const startValue = this.animation.startX;
    const changeInValue = this.animation.changeInValue;
    this.startTranslateX = linearTween(timeInAnimation, startValue, changeInValue,
      this.transitionDuration);
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

    if (this.opened) {
      // document.body.style.overflowY = 'hidden';
      this.scrim.style.pointerEvents = 'all';
      this.content.classList.add('y-drawer-opened');
    } else {
      // document.body.style.overflowY = '';
      this.scrim.style.pointerEvents = '';

      // only remove the styles when closing the drawer,
      // since we eitehr expect a navigation (page reload)
      // or closing the drawer again, ie more changes
      this.content.style.willChange = '';
      this.scrim.style.willChange = '';
    }
  }

  updateDOM(translateX, sliderWidth) {
    this.content.style.transform = `translate3d(${translateX}px,0,0)`;
    this.scrim.style.opacity = translateX / sliderWidth;
  }

  // @override
  defaults() {
    return {
      opened: false,
      transitionDuration: 200,
      persistent: false,
    };
  }

  // @override
  sideEffects() {
    return {
      opened: (mO) => {
        if (mO === true) {
          this.open();
        } else {
          this.close();
        }
      },
      persistent: (d) => {
        if (d === true) {
          this.scrim.style.display = 'none';
          this.removeEventListeners();
          this.setState('persistent', true);
        } else {
          this.scrim.style.display = '';
          this.addEventListeners();
          this.setState('persistent', false);
        }
      },
    };
  }

  close() {
    this.animateTo(false);
  }

  getMovableSliderWidth() {
    // Since part of the slider could be visible,
    // the width that is "movable" is less than the complete slider width
    // and given by
    return -this.content.offsetLeft;
  }

  open() {
    this.animateTo(true);
  }

  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }
};
