// Copyright (C) 2017  Florian Klampfer
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

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

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

import componentCore from 'y-component/src/component-core';
import { Observable } from 'rxjs';
// import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { linearTween, pageDist } from '../common';

const Symbol = global.Symbol || (x => `_${x}`);

const IDLE = Symbol('idle');
const TOUCHING = Symbol('touching');
const START_ANIMATING = Symbol('startAnimating');
const ANIMATING = Symbol('animating');

const VELOCITY_THRESHOLD = 0.2;
const VELOCITY_LINEAR_COMBINATION = 0.8;

function pauseWith(pauser$) {
  return this.withLatestFrom(pauser$)
      .filter(([, paused]) => paused === false)
      .map(([x]) => x);
}

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

    this.setupObservables();

    return this;
  }

  cacheDOMElements() {
    this.scrim = this.root.querySelector('.y-drawer-scrim');
    this.content = this.root.querySelector('.y-drawer-content');
  }

  defProperties() {
    this.startX = 0;
    this.startY = 0;
    this.pageX = 0;
    this.pageY = 0;
    this.lastPageX = 0;
    this.lastPageY = 0;
    this.isScrolling = true;
    this.startedMoving = false;
    this.loopState = IDLE;
    this.velocity = 0;
    this.startTranslateX = 0;
    this.translateX = 0;
    this.animationFrameRequested = false;
    this.touching = false;
    this.lastTime = true;
    this.sliderWidth = true;
    this.animation = true;
  }

  bindCallbacks() {
    this.touchStartCallback = this.touchStartCallback.bind(this);
    this.touchMoveCallback = this.touchMoveCallback.bind(this);
    this.touchEndCallback = this.touchEndCallback.bind(this);
    this.scrimClickCallback = this.scrimClickCallback.bind(this);
    this.animationFrameCallback = this.animationFrameCallback.bind(this);
  }

  addEventListeners() {
    // document.addEventListener('touchstart', this.touchStartCallback, { passive: false });
    // document.addEventListener('touchmove', this.touchMoveCallback, { passive: false });
    // document.addEventListener('touchend', this.touchEndCallback, { passive: false });
    //
    // this.scrim.addEventListener('click', this.scrimClickCallback);
  }

  setupObservables() {
    const touchend$ = Observable.fromEvent(document, 'touchend').share();
    const close$ = Observable.fromEvent(this.scrim, 'click');

    const touchstart$ = Observable.fromEvent(document, 'touchstart')
      .filter(({ touches }) => touches.length === 1) // TODO: necessary?
      .map(({ touches: [touch], timeStamp }) => Object.assign(touch, {
        timeStamp,
        sliderWidth: this.getMovableSliderWidth(),
      }))
      .share();

    // TODO: rename
    // basically means this is a touch in the right region, that MIGHT trigger sliding
    const touching$ = touchstart$
      .map(({ pageX }) => /* this.opened || */ pageX > window.innerWidth / 3)
      .do(this.prepInteraction.bind(this));

    // const sliding$ = TODO

    const touchmove$ = pauseWith.call(Observable.fromEvent(document, 'touchmove'), touching$)
      // .do(x => console.log(x))
      .map(({ touches, timeStamp }) =>
        Object.assign(
          Array.prototype.find.call(touches, t => t.identifier === 0),
          { timeStamp },
        ),
      )
      .share();

    const translateX$ = touchmove$
      .withLatestFrom(touchstart$)
      .map(([{ pageX }, { pageX: startX, sliderWidth }]) => {
        const deltaX = pageX - startX;
        let translateX = /* this.startTranslateX */ 0 + deltaX;
        translateX = Math.max(0, Math.min(sliderWidth, translateX));
        return [translateX, sliderWidth];
      })
      .share();

    const velocity$ = touchmove$
      .pairwise()
      .scan((velocity, [{ pageX: lastPageX, timeStamp: lastTimeStamp },
                        { pageX, timeStamp }]) => {
        const pageXDiff = pageX - lastPageX;
        const timeDiff = timeStamp - lastTimeStamp;
        return (VELOCITY_LINEAR_COMBINATION * (pageXDiff / timeDiff)) +
               ((1 - VELOCITY_LINEAR_COMBINATION) * velocity);
      }, 0);
      // .do(v => console.log(v))

    const opened$ = touchend$
      .withLatestFrom(velocity$, translateX$)
      .map(([, velocity, [translateX, sliderWidth]]) => {
        if (velocity > VELOCITY_THRESHOLD) {
          return true;
        } else if (velocity < -VELOCITY_THRESHOLD) {
          return false;
        } else if (translateX >= sliderWidth / 2) {
          return true;
        }
        return false;
      })
      // .do(opened => this.setStateKV('opened', opened))

    const anim$ = opened$
      .withLatestFrom(translateX$)
      .switchMap(([opened, [translateX, sliderWidth]]) => {
        const animStartX = translateX;
        const animEndX = (opened ? 1 : 0) * sliderWidth;
        const animChangeInValue = animEndX - animStartX;
        const transitionDuration = this.transitionDuration;
        let animStartTime;


        return Observable.create((observer) => {
          const id = requestAnimationFrame(function f(time) {
            animStartTime = animStartTime || time; // TODO: this seems a bit hacky

            const timeInAnimation = time - animStartTime;

            if (timeInAnimation < transitionDuration) {
              const startValue = animStartX;
              const changeInValue = animChangeInValue;

              observer.next([
                linearTween(timeInAnimation, startValue, changeInValue, transitionDuration),
                sliderWidth,
              ]);

              requestAnimationFrame(f);
            } else {
              observer.next([animEndX, sliderWidth]);
              observer.complete();
            }
          });

          return () => { cancelAnimationFrame(id); };
        })
        .do(null, null, () => {
          if (opened) {
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
        });
      })

    translateX$.merge(anim$)
      .do(args => this.updateDOM(...args))
      .subscribe();
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
