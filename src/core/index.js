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

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions,
no-console */

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

// function pauseWith(pauser$) {
//   return this.withLatestFrom(pauser$)
//       .filter(([, paused]) => paused === false)
//       .map(([x]) => x);
// }

function createTween(tween, b, c, d, s) {
  let animStartTime;
  return Observable.create((observer) => {
    const id = requestAnimationFrame(function sampleTween(time) {
      animStartTime = animStartTime || time;
      const timeInAnimation = time - animStartTime;
      if (timeInAnimation < d) {
        observer.next(tween(timeInAnimation, b, c, d, s));
        requestAnimationFrame(sampleTween);
      } else {
        observer.next(tween(d, b, c, d, s));
        observer.complete();
      }
    });
    return () => { cancelAnimationFrame(id); };
  });
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
      transitionDuration: 250,
      persistent: false,
      nativeMargin: 0,
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
    // const close$ = Observable.fromEvent(this.scrim, 'click');

    // TODO: recalculate on change!? let user provide width?
    const sliderWidth = this.getMovableSliderWidth();

    this.translateX$ = Observable.defer(() =>
      Observable.fromEvent(document, 'touchstart', { passive: true })
        .filter(({ touches }) => touches.length === 1)
        .map(({ touches: [touch] }) => touch)
        .withLatestFrom(this.translateX$.startWith({ translateX: 0, opened: false }))
        .filter(([{ pageX }, { opened }]) => this.isInSlideRange(pageX, sliderWidth, opened))
        .do(this.prepInteraction.bind(this))
        .switchMap(([startTouch, { translateX: startTranslateX }]) => {
          const { pageX: startX, pageY: startY } = startTouch;

          const isScrolling$ = Observable.defer(() => this.touchmove$
            .first()
            .map(({ pageX, pageY }) => Math.abs(startY - pageY) > Math.abs(startX - pageX))
            .startWith(undefined));

          const touchend$ = Observable.fromEvent(document, 'touchend', { passive: true })
            .withLatestFrom(isScrolling$)
            .filter(([e, isScrolling]) => !isScrolling || e.touches.length === 0)
            .share();

          this.touchmove$ = Observable.fromEvent(document, 'touchmove', { passive: true })
            .map(({ touches }) => Array.prototype.find.call(touches, t => t.identifier === 0))
            .withLatestFrom(isScrolling$)
            .filter(([, isScrolling]) => !isScrolling)
            .map(([snowball]) => {
              const { pageX } = snowball;

              const deltaX = pageX - startX;
              let translateX = startTranslateX + deltaX;
              translateX = Math.max(0, Math.min(sliderWidth, translateX));

              return Object.assign(snowball, { translateX });
            })
            .takeUntil(touchend$)
            .share();

          const velocity$ = this.touchmove$
            .startWith(startTouch)
            .timestamp()
            .pairwise()
            .scan(this.velocityReducer.bind(this), 0);

          const anim$ = touchend$
            .withLatestFrom(this.touchmove$, velocity$)
            .map(([, snowball, velocity]) => {
              const { translateX } = snowball;
              const opened = this.calcOpened(velocity, translateX, sliderWidth);
              return Object.assign(snowball, { opened });
            })
            .do(() => {
              // if (this.touching) {
              //   if (this.isScrolling || e.touches.length > 0) {
              //     return;
              //   }
              // if (this.startedMoving) {
              //   this.updateMenuOpen();
              // }
              if (this.opened) {
                this.scrim.style.pointerEvents = 'all';
              } else {
                this.scrim.style.pointerEvents = '';
              }
              // }
            })
            .first() // TODO: better way to close the outer observable?
            // .merge(this.openedChanged$
            //   .withLatestFrom(this.translateX$))
            //   .map(([opened, { translateX }]) => ({ translateX, opened }))
            .mergeMap((snowball) => {
              const { translateX, opened } = snowball;

              const endTranslateX = (opened ? 1 : 0) * sliderWidth;
              const diffTranslateX = endTranslateX - translateX;

              return createTween(linearTween, translateX, diffTranslateX, this.transitionDuration)
                .map(sample => Object.assign(snowball, { translateX: sample }))
                .do(null, null, this.cleanupInteraction.bind(this, opened));
            });

          return Observable.merge(this.touchmove$, anim$);
            // .do(null, () => console.error('aborted?'), () => console.log('$1 + $2 finished'));
        }),
      )
      .share();

    this.translateX$
      .do(({ translateX }) => this.updateDOM(translateX, sliderWidth))
      .do(null, e => console.error(e))
      .catch((e, c) => c)
      .subscribe();
  }

  isInSlideRange(pageX, sliderWidth, opened) {
    return opened || (pageX > this.nativeMargin && pageX < sliderWidth);
  }

  velocityReducer(velocity, [prevSnowball, snowball]) {
    const { value: { pageX: lastPageX }, timestamp: lastTimestamp } = prevSnowball;
    const { value: { pageX }, timestamp } = snowball;

    const pageXDiff = pageX - lastPageX;
    const timeDiff = timestamp - lastTimestamp;

    return (VELOCITY_LINEAR_COMBINATION * (pageXDiff / timeDiff)) +
           ((1 - VELOCITY_LINEAR_COMBINATION) * velocity);
  }

  // TODO: rename
  calcOpened(velocity, translateX, sliderWidth) {
    if (velocity > VELOCITY_THRESHOLD) {
      return true;
    } else if (velocity < -VELOCITY_THRESHOLD) {
      return false;
    } else if (translateX >= sliderWidth / 2) {
      return true;
    }
    return false;
  }

  removeEventListeners() {
    // // document.removeEventListener('touchstart', this.touchStartCallback, { passive: false });
    // // document.removeEventListener('touchmove', this.touchMoveCallback, { passive: false });
    // // document.removeEventListener('touchend', this.touchEndCallback, { passive: false });
    // //
    // this.scrim.removeEventListener('click', this.scrimClickCallback);
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
    // this.sliderWidth = this.getMovableSliderWidth();
  }

  cleanupInteraction(opened) {
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
