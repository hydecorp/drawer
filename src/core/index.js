// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import componentCore from 'y-component/src/component-core';

import { linearTween, pageDist } from '../common';

// const JS_FEATURES = [
//   'fn/array/for-each',
//   'fn/function/bind',
//   'fn/number/constructor',
//   'fn/object/assign',
//   'fn/object/define-property',
//   'fn/object/keys',
//   'fn/array/reduce',
// ];
//
// const MODERNIZR_TESTS = [
//   'customevent',
//   'eventlistener',
//   'queryselector',
//   'requestanimationframe',
//   'classlist',
//   'opacity',
//   'csstransforms',
//   'csspointerevents',
// ];

const Symbol = global.Symbol || (x => `_${x}`);

const IDLE = Symbol('idle');
const TOUCHING = Symbol('touching');
const START_ANIMATING = Symbol('startAnimating');
const ANIMATING = Symbol('animating');

const VELOCITY_THRESHOLD = 0.2;
const VELOCITY_LINEAR_COMBINATION = 0.8;

const def = Object.defineProperty.bind(Object);

export default C => class extends componentCore(C) {

  // @override
  getComponentName() {
    return 'y-drawer';
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
      opened: (o) => {
        if (o === true) this.open();
        else this.close();
      },
      persistent: (d) => {
        if (d === true) this.persist();
        else this.unpersist();
      },
    };
  }

  // @override
  setupComponent(el, props) {
    super.setupComponent(el, props);

    this.cacheDOMElements();
    this.defProperties();
    this.bindCallbacks();

    this.jumpTo(this.opened);
    if (!this.persistent) this.addEventListeners();
    if (this.persistent) this.scrim.style.display = 'none';

    return this;
  }

  cacheDOMElements() {
    def(this, 'scrim', { value: this.root.querySelector('.y-drawer-scrim') });
    def(this, 'content', { value: this.root.querySelector('.y-drawer-content') });
  }

  defProperties() {
    def(this, 'startX', { value: 0, writable: true });
    def(this, 'startY', { value: 0, writable: true });
    def(this, 'pageX', { value: 0, writable: true });
    def(this, 'pageY', { value: 0, writable: true });
    def(this, 'lastPageX', { value: 0, writable: true });
    def(this, 'lastPageY', { value: 0, writable: true });
    def(this, 'isScrolling', { writable: true });
    def(this, 'startedMoving', { value: false, writable: true });
    def(this, 'loopState', { value: IDLE, writable: true });
    def(this, 'velocity', { value: 0, writable: true });
    def(this, 'startTranslateX', { value: 0, writable: true });
    def(this, 'translateX', { value: 0, writable: true });
    def(this, 'animationFrameRequested', { value: false, writable: true });
    def(this, 'touching', { value: false, writable: true });
    def(this, 'lastTime', { writable: true });
    def(this, 'sliderWidth', { writable: true });
    def(this, 'animation', { writable: true, configurable: true });
  }

  bindCallbacks() {
    def(this, 'touchStartCallback', { value: this.touchStartCallback.bind(this) });
    def(this, 'touchMoveCallback', { value: this.touchMoveCallback.bind(this) });
    def(this, 'touchEndCallback', { value: this.touchEndCallback.bind(this) });
    def(this, 'scrimClickCallback', { value: this.scrimClickCallback.bind(this) });
    def(this, 'animationFrameCallback', { value: this.animationFrameCallback.bind(this) });
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
      this.startX = touch.pageX;
      this.startY = touch.pageY;
      this.pageX = touch.pageX;
      this.pageY = touch.pageY;
      this.lastPageX = touch.pageX;
      this.lastPageY = touch.pageY;

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

  getMovableSliderWidth() {
    // Since part of the slider could be visible,
    // the width that is "movable" is less than the complete slider width
    // and given by
    return -this.content.offsetLeft;
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
    this.startTranslateX = opened * this.sliderWidth;
    this.endAnimating();
    this.updateDOM(this.startTranslateX, this.sliderWidth);
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
    this.loopState = IDLE;
    this.velocity = 0;

    if (this.opened) {
      // document.body.style.overflowY = 'hidden';
      this.scrim.style.pointerEvents = 'all';
      this.content.classList.add('y-drawer-opened');
    } else {
      // document.body.style.overflowY = '';
      this.scrim.style.pointerEvents = '';
    }

    this.content.style.willChange = '';
    this.scrim.style.willChange = '';

    this.fireEvent('transitioned');
  }

  updateDOM(translateX, sliderWidth) {
    this.content.style.transform = `translateX(${translateX}px)`;
    this.scrim.style.opacity = translateX / sliderWidth;
  }

  close() {
    this.animateTo(false);
    return this;
  }

  open() {
    this.animateTo(true);
    return this;
  }

  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
    return this;
  }

  persist() {
    this.scrim.style.display = 'none';
    this.removeEventListeners();
    this.setState('persistent', true);
  }

  unpersist() {
    this.scrim.style.display = '';
    this.addEventListeners();
    this.setState('persistent', false);
  }
};
