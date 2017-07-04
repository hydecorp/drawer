// Copyright (c) 2017 Florian Klampfer
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

// const JS_FEATURES = [
//   'fn/array/find',
//   'fn/array/for-each',
//   'fn/array/reduce',
//   'fn/function/bind',
//   'fn/number/constructor',
//   'fn/object/assign',
//   'fn/object/define-property',
//   'fn/object/keys',
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

import { componentMixin } from 'y-component';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
// import { merge } from 'rxjs/observable/merge';
// import { never } from 'rxjs/observable/never';
// import { of } from 'rxjs/observable/of';
// import { zip } from 'rxjs/observable/zip';

// import { _catch as recover } from 'rxjs/operator/catch';
import { _do as effect } from 'rxjs/operator/do';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
// import { mapTo } from 'rxjs/operator/mapTo';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { merge as mergeWith } from 'rxjs/operator/merge';
import { pairwise } from 'rxjs/operator/pairwise';
import { repeatWhen } from 'rxjs/operator/repeatWhen';
import { sample } from 'rxjs/operator/sample';
// import { scan } from 'rxjs/operator/scan';
import { share } from 'rxjs/operator/share';
// import { skipWhile } from 'rxjs/operator/skipWhile';
import { startWith } from 'rxjs/operator/startWith';
// import { switchMap } from 'rxjs/operator/switchMap';
import { take } from 'rxjs/operator/take';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { timestamp } from 'rxjs/operator/timestamp';
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';

import { createTween, linearTween } from '../common';

// const Symbol = global.Symbol || (x => `_${x}`);
//
// const IDLE = Symbol('idle');
// const TOUCHING = Symbol('touching');
// const START_ANIMATING = Symbol('startAnimating');
// const ANIMATING = Symbol('animating');

const VELOCITY_THRESHOLD = 0.2; // px/ms
// const VELOCITY_LINEAR_COMBINATION = 0.8;
// const SLIDE_THRESHOLD = 30;

const abs = ::Math.abs;
// const sqrt = ::Math.sqrt;
const min = ::Math.min;
const max = ::Math.max;
const assign = ::Object.assign;

// Like `filter`, but takes a stream of booleans instead of a predicate.
// Similar to `pauseable`, but will not unsubscribe from the source observable.
// NOTE: Writing a custom observabele would probably be a more efficient way of doing this
function filterWith(p$) {
  return this::withLatestFrom(p$)
      ::filter(([, p]) => p)
      ::map(([x]) => x);
}

// function pauseable(pauser$) {
//   return pauser$::switchMap(paused => (paused ? Observable::never() : this));
// }

function cacheDOMElements() {
  this.scrim = this.root.querySelector('.y-drawer-scrim');
  this.content = this.root.querySelector('.y-drawer-content');
}

// function velocityReducer(velocity, [prevSnowball, snowball]) {
//   const { value: { clientX: prevPageX }, timestamp: prevTime } = prevSnowball;
//   const { value: { clientX }, timestamp: time } = snowball;
//
//   const pageXDiff = clientX - prevPageX;
//   const timeDiff = time - prevTime;
//
//   return (VELOCITY_LINEAR_COMBINATION * (pageXDiff / timeDiff)) +
//          ((1 - VELOCITY_LINEAR_COMBINATION) * velocity);
// }

function isInRange(clientX, drawerWidth, opened) {
  return opened || (clientX > this.edgeMargin && clientX < drawerWidth / 2);
}

// Based on current velocity and position of drawer, will the drawer be open, or snap back?
// TODO: could incorporate the current open state of the drawer
function calcWillOpen(velocity, translateX, drawerWidth) {
  if (velocity > VELOCITY_THRESHOLD) {
    return true;
  } else if (velocity < -VELOCITY_THRESHOLD) {
    return false;
  } else if (translateX >= drawerWidth / 2) {
    return true;
  } else {
    return false;
  }
}

// Calcuate the current position of the drawer,
// by taking the different between the current and starting postion of the thumb,
// then applying the difference to the starting position of the drawer.
// This way, we avoid snapping the drawer to the thumb, when catching it mid-animtion.
// Will also clip the position at 0 and the width of the drawer.
function calcTranslateX(clientX, startX, startTranslateX, drawerWidth) {
  const deltaX = clientX - startX;
  const translateX = startTranslateX + deltaX;
  return max(0, min(drawerWidth, translateX));
}

function prepInteraction() {
  this.content.style.willChange = 'transform';
  this.scrim.style.willChange = 'opacity';
  this.content.classList.remove('y-drawer-opened');
  // this.drawerWidth = this.getMovableDrawerWidth();
}

function cleanupAnimation(opened) {
  if (opened) {
    // document.body.style.overflowY = 'hidden';
    this.scrim.style.pointerEvents = 'all';
    this.content.classList.add('y-drawer-opened');
  } else {
    this.scrim.style.pointerEvents = '';

    // TODO: set earlier
    if (this.scrollContainer) {
      this.scrollContainer.style.overflowY = '';
    }
  }

  this.content.style.willChange = '';
  this.scrim.style.willChange = '';

  this.fireEvent('transitioned');
}

function getMovableDrawerWidth() {
  // Since part of the drawer could be visible,
  // the width that is "movable" is less than the complete drawer width
  // and given by
  return -this.content.offsetLeft;
}

function updateDOM(translateX, drawerWidth) {
  this.content.style.transform = `translateX(${translateX}px)`;
  this.scrim.style.opacity = translateX / drawerWidth;
}

function setupObservables() {
  const { find } = Array.prototype;

  // const scrimClick$ = Observable::fromEvent(this.scrim, 'click');

  this.opened$ = new Subject();
  this.persistent$ = new Subject();

  const temp = {};

  // TODO: recalculate on change. let user provide width?
  const drawerWidth = this::getMovableDrawerWidth();

  const touchstart$ = Observable::fromEvent(document, 'touchstart', {
    passive: !this.preventDefault,
  })
    ::filter(({ touches }) => touches.length === 1)
    ::map(({ touches }) => touches[0])
    ::share();

  // as long as the scrim is visible, the user can still "catch" the drawer mid-animation
  const scrimVisible$ = Observable::defer(() =>
    temp.translateX$::map(translateX => translateX > 0)::startWith(false));

  // indicates whether the touch positon is within the range (x-axis)
  // from where to open the drawer.
  const inRange$ = touchstart$
    ::withLatestFrom(scrimVisible$)
    ::map(([{ clientX }, scrimVisible]) => this::isInRange(clientX, drawerWidth, scrimVisible))
    ::effect((inRange) => { if (inRange) { this::prepInteraction(); } })
    ::share();

  const touchmove$ = Observable::fromEvent(document, 'touchmove', {
    passive: !this.preventDefault,
  })
    ::filterWith(inRange$)
    ::withLatestFrom(touchstart$)
    ::map(([e, { identifier: startIdentifier }]) =>
      // TODO: what if the finger is no longer available?
      assign(e.touches::find(t => t.identifier === startIdentifier), { e }))
    ::share();

  const touchend$ = Observable::fromEvent(document, 'touchend', {
    passive: !this.preventDefault,
  })
    ::filterWith(inRange$)
    ::filter(({ touches }) => touches.length === 0)
    ::share();

  // const isSliding$ = touchmove$
  //   ::withLatestFrom(touchstart$)
  //   ::skipWhile(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
  //     abs(startY - clientY) < SLIDE_THRESHOLD && abs(startX - clientX) < SLIDE_THRESHOLD)
  //   ::take(1)
  //   ::map(([{ clientX, clientY }, { clientX: startX, clientY: startY }]) =>
  //     abs(startX - clientX) > abs(startY - clientY))
  //   ::startWith(undefined)
  //   ::repeatWhen(() => touchend$)
  //   ::share();

  const isSliding$ = touchmove$
    ::withLatestFrom(touchstart$)
    ::map(([{ clientX, clientY, e }, { clientX: startX, clientY: startY }]) => {
      const isSliding = abs(startX - clientX) > abs(startY - clientY);
      if (isSliding) {
        if (this.preventDefault) e.preventDefault();
        if (this.scrollContainer) this.scrollContainer.style.overflowY = 'hidden';
      }
      return isSliding;
    })
    ::take(1)
    ::startWith(undefined)
    ::repeatWhen(() => touchend$)
    ::share();

  // const isScrolling$ = isSliding$::map(x => (x === undefined ? undefined : !x));

  // const startedMoving$ = touchmove$
  //   ::take(1)
  //   ::mapTo(true)
  //   ::startWith(false)
  //   ::repeatWhen(() => touchstart$)
  //   ::share();

  temp.translateX$ = Observable::defer(() =>
    touchmove$
      ::filterWith(isSliding$)
      ::effect(({ e }) => { if (this.preventDefault) e.preventDefault(); })
      ::withLatestFrom(touchstart$, temp.startTranslateX$)
      ::map(([{ clientX }, { clientX: startX }, startTranslateX]) =>
        this::calcTranslateX(clientX, startX, startTranslateX, drawerWidth))
      ::mergeWith(temp.anim$))
    ::share();

  temp.startTranslateX$ = temp.translateX$
    ::sample(touchstart$)
    ::startWith(0);

  const velocity$ = temp.translateX$
    ::timestamp()
    ::pairwise()
    ::map(([{ value: x, timestamp: time },
            { value: prevX, timestamp: prevTime }]) =>
      (x - prevX) / (time - prevTime))
    ::startWith(0);

  const willOpen$ = touchend$
    ::withLatestFrom(temp.translateX$, velocity$)
    ::map(([, translateX, velocity]) =>
      this::calcWillOpen(velocity, translateX, drawerWidth));

  // TODO: make it clearer what is happenign here
  // temp.anim$ = Observable::merge(
  //     touchend$::filterWith(isSliding$),
  //     isScrolling$::filter(isScrolling => isScrolling === true),
  //   )
  temp.anim$ = touchend$
    ::withLatestFrom(temp.translateX$, willOpen$)
    ::mergeMap(([, translateX, willOpen]) => {
      const endTranslateX = (willOpen ? 1 : 0) * drawerWidth;
      const diffTranslateX = endTranslateX - translateX;
      return createTween(linearTween, translateX, diffTranslateX, this.transitionDuration)
        ::effect(null, null, () => this::cleanupAnimation(willOpen))
        // ::effect(null, null, () => { if (willOpen === false) this.opened$.next(false); })
        ::takeUntil(touchstart$);
    });

  temp.translateX$
    ::effect(translateX => this::updateDOM(translateX, drawerWidth) /* , ::console.error */)
    // ::recover((e, c) => c)
    .subscribe();
}

export default C => class extends componentMixin(C) {

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
      edgeMargin: 0,
      preventDefault: false,
      scrollContainer: document.body,
    };
  }

  // @override
  sideEffects() {
    return {
      opened: x => this.opened$.next(x),
      persistent: x => this.persistent$.next(x),
    };
  }

  // @override
  setupComponent(el, props) {
    super.setupComponent(el, props);

    this::cacheDOMElements();
    this::setupObservables();
    // this.defProperties();
    // this.bindCallbacks();

    // this.jumpTo(this.opened);
    // if (!this.persistent) this.addEventListeners();
    if (this.persistent) this.scrim.style.display = 'none';

    return this;
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
    // this.removeEventListeners();
    this.setState('persistent', true);
  }

  unpersist() {
    this.scrim.style.display = '';
    // this.addEventListeners();
    this.setState('persistent', false);
  }

  animateTo() {
    // this.prepInteraction();
    // this.setState('opened', opened);
    // this.loopState = START_ANIMATING;
    // this.requestAnimationLoop();
  }

  jumpTo() {
    // this.prepInteraction();
    // this.setState('opened', opened);
    // this.loopState = IDLE;
    // this.startTranslateX = opened * this.drawerWidth;
    // this.endAnimating();
    // this.updateDOM(this.startTranslateX, this.drawerWidth);
  }
};
