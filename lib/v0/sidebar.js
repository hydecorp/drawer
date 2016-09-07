(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.y||(g.y = {}));g=(g.sidebar||(g.sidebar = {}));g.v0 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  var styles = window.getComputedStyle(document.documentElement, '');
  var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
  return {
    prefix: '-' + pre + '-',
    transform: pre[0].toUpperCase() + pre.substr(1) + 'Transform'
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
  return c * t / d + b;
}

var IDLE = 'IDLE';
var TOUCHING = 'TOUCHING';
var START_ANIMATING = 'START_ANIMATING';
var ANIMATING = 'ANIMATING';

// TODO: make configureable
var DURATION = 200;
var MAX_OPACITY = 0.67;
var VELOCITY_THRESHOLD = 0.33;
var VELOCITY_LINEAR_COMBINATION = 0.6;

var browerCapabilities = getBrowserCapabilities();
// const transformPrefix = browerCapabilities.prefix;
var transformProperty = browerCapabilities.transform;

// TODO: don't ployfill as part of the component
// polyfillRequestAnimationFrame();

// TODO: tap component!?
// new Tap(backdrop);
// new Tap(menu);

var SidebarCore = function () {
  function SidebarCore(el) {
    _classCallCheck(this, SidebarCore);

    this.el = this.setupDOM(el);
    this.cacheDOMElements();
    this.resetProperties();
    this.bindCallbacks();
    this.addEventListeners();
    this.onResize();
  }

  _createClass(SidebarCore, [{
    key: 'setupDOM',
    value: function setupDOM(el) {
      return el;
    }
  }, {
    key: 'cacheDOMElements',
    value: function cacheDOMElements() {
      this.layout = this.el.querySelector('.y-layout');
      this.backdrop = this.el.querySelector('.y-backdrop');
      this.sidebar = this.el.querySelector('.y-sidebar');
    }
  }, {
    key: 'resetProperties',
    value: function resetProperties() {
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
  }, {
    key: 'bindCallbacks',
    value: function bindCallbacks() {
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
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      document.addEventListener('touchstart', this.onTouchStart);
      // document.addEventListener('mousedown', this.onMouseDown);

      this.backdrop.addEventListener('click', this.onBackdropClick);

      window.addEventListener('resize', this.onResize);
      window.addEventListener('orientationchange', this.onResize);
    }
  }, {
    key: 'requestAnimationLoop',
    value: function requestAnimationLoop() {
      if (!this.animationFrameRequested) {
        this.animationFrameRequested = true;
        requestAnimationFrame(this.onAnimationFrame);
      }
    }
  }, {
    key: 'distanceToLastTouch',
    value: function distanceToLastTouch(p) {
      return Math.sqrt(Math.pow(this.pageX - p.pageX, 2) + Math.pow(this.pageY - p.pageY, 2));
    }
  }, {
    key: 'getNearestTouch',
    value: function getNearestTouch(touches) {
      var _this = this;

      return Array.prototype.reduce.call(touches, function (acc, touch) {
        var dist = _this.distanceToLastTouch(touch);
        return dist < acc.dist ? { dist: dist, touch: touch } : acc;
      }, {
        dist: Number.POSITIVE_INFINITY,
        touch: null
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

  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
      if (e.touches.length === 1) {
        this.isScrolling = undefined;

        var touch = e.touches[0];
        this.startX = this.pageX = this.lastPageX = touch.pageX;
        this.startY = this.pageY = this.lastPageY = touch.pageY;

        if (this.menuOpen || this.pageX < window.innerWidth / 3) {
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

  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      var touch = this.getNearestTouch(e.touches);
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

  }, {
    key: 'updateMenuOpen',
    value: function updateMenuOpen() {
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

  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e) {
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

  }, {
    key: 'onBackdropClick',
    value: function onBackdropClick(e) {
      e.preventDefault();
      this.close();
    }
  }, {
    key: 'prepInteraction',
    value: function prepInteraction() {
      this.sidebar.style.willChange = 'transform';
      this.backdrop.style.willChange = 'opacity';
      this.sliderWidth = this.getMovableSliderWidth();
    }
  }, {
    key: 'animateTo',
    value: function animateTo(menuOpen) {
      this.prepInteraction();
      this.menuOpen = menuOpen;
      this.state = START_ANIMATING;
      this.requestAnimationLoop();
    }

    // FIXME

  }, {
    key: 'jumpTo',
    value: function jumpTo(menuOpen) {
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

  }, {
    key: 'getMovableSliderWidth',
    value: function getMovableSliderWidth() {
      return -this.sidebar.offsetLeft;
    }
  }, {
    key: 'updateTranslateX',
    value: function updateTranslateX() {
      var deltaX = this.pageX - this.startX;
      this.translateX = this.startTranslateX + deltaX;
      this.translateX = Math.max(0, Math.min(this.sliderWidth, this.translateX));
      return deltaX;
    }
  }, {
    key: 'onAnimationFrame',
    value: function onAnimationFrame(time) {
      switch (this.state) {
        case TOUCHING:
          {
            this.onTouching(time);
            break;
          }

        case START_ANIMATING:
          {
            this.onStartAnimating(time);
            this.onAnimationFrame(time); // jump to next case block
            break;
          }

        case ANIMATING:
          {
            this.onAnimating(time);
            break;
          }

        default:
          {
            break;
          }
      }
    }
  }, {
    key: 'onTouching',
    value: function onTouching(time) {
      var timeDiff = time - this.lastTime;

      if (timeDiff > 0) {
        var pageXDiff = this.pageX - this.lastPageX;
        this.velocity = VELOCITY_LINEAR_COMBINATION * pageXDiff / timeDiff + (1 - VELOCITY_LINEAR_COMBINATION) * this.velocity;
      }

      this.updateTranslateX();
      this.updateDOM(this.translateX, this.sliderWidth);

      this.lastTime = time;
      this.lastPageX = this.pageX;
      this.lastPageY = this.pageY;

      requestAnimationFrame(this.onAnimationFrame);
    }
  }, {
    key: 'onStartAnimating',
    value: function onStartAnimating(time) {
      this.updateTranslateX();

      this.animationStartX = this.translateX;
      this.animationEndX = this.menuOpen * this.sliderWidth;
      this.animationChangeInValue = this.animationEndX - this.animationStartX;
      this.animationStartTime = time;

      this.state = ANIMATING;
    }
  }, {
    key: 'onAnimating',
    value: function onAnimating(time) {
      var timeInAnimation = time - this.animationStartTime;

      if (timeInAnimation < DURATION) {
        this.onAnimatingCont(timeInAnimation);
      } else {
        this.onAnimatingEnd();
      }

      this.updateDOM(this.startTranslateX, this.sliderWidth);
    }
  }, {
    key: 'onAnimatingCont',
    value: function onAnimatingCont(timeInAnimation) {
      var startValue = this.animationStartX;
      var changeInValue = this.animationChangeInValue;
      this.startTranslateX = linearTween(timeInAnimation, startValue, changeInValue, DURATION);
      requestAnimationFrame(this.onAnimationFrame);
    }
  }, {
    key: 'onAnimatingEnd',
    value: function onAnimatingEnd() {
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
  }, {
    key: 'updateDOM',
    value: function updateDOM(translateX, sliderWidth) {
      this.sidebar.style[transformProperty] = 'translate3d(' + translateX + 'px,0,0)';
      this.backdrop.style.opacity = MAX_OPACITY * (translateX / sliderWidth);
    }
  }, {
    key: 'enableSlider',
    value: function enableSlider() {
      this.layout.classList.add('y-active');
      // this._jumpTo(0);
    }
  }, {
    key: 'disableSlider',
    value: function disableSlider() {
      this.layout.classList.remove('y-active');
      // this._jumpTo(1);
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      if (window.matchMedia('(min-width: 48em)').matches) {
        this.disableSlider();
      } else {
        this.enableSlider();
      }
    }
  }, {
    key: 'open',
    value: function open(opts) {
      var options = Object.assign({ animate: true }, opts);
      if (options.animate) {
        this.animateTo(1);
      } else {
        this.jumpTo(1);
      }
    }
  }, {
    key: 'close',
    value: function close(opts) {
      var options = Object.assign({ animate: true }, opts);
      if (options.animate) {
        this.animateTo(0);
      } else {
        this.jumpTo(0);
      }
    }
  }, {
    key: 'toggle',
    value: function toggle(opts) {
      if (this.menuOpen === 1) {
        this.close(opts);
      } else {
        this.open(opts);
      }
    }
  }]);

  return SidebarCore;
}();

exports.default = SidebarCore;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sidebar = require('../core/sidebar');

var _sidebar2 = _interopRequireDefault(_sidebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SidebarV0 = function (_SidebarCore) {
  _inherits(SidebarV0, _SidebarCore);

  function SidebarV0() {
    _classCallCheck(this, SidebarV0);

    return _possibleConstructorReturn(this, (SidebarV0.__proto__ || Object.getPrototypeOf(SidebarV0)).apply(this, arguments));
  }

  _createClass(SidebarV0, [{
    key: 'setupDOM',
    value: function setupDOM(el) {
      var shadowRoot = el.createShadowRoot();

      // TODO: better why to get template?
      var instance = document.querySelector('link[href$="v0/sidebar.html"]').import.getElementById('y-sidebar-template').content.cloneNode(true);

      shadowRoot.appendChild(instance);

      return shadowRoot;
    }
  }]);

  return SidebarV0;
}(_sidebar2.default);

exports.default = SidebarV0;


function isTruthyAttrVal(v) {
  return v != null && v !== 'false' && v !== 'null' && v !== 'undefined';
}

document.registerElement('y-sidebar', function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.sidebar = new SidebarV0(this);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var attr = _step.value;

          this.attributeChangedCallback(attr.name, undefined, attr.value);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case 'menu-open':
          {
            if (isTruthyAttrVal(newVal)) {
              this.open();
            } else {
              this.close();
            }
            break;
          }
        default:
          {
            break;
          }
      }
    }
  }, {
    key: 'open',
    value: function open(opts) {
      this.sidebar.open(opts);
    }
  }, {
    key: 'close',
    value: function close(opts) {
      this.sidebar.close(opts);
    }
  }, {
    key: 'toggle',
    value: function toggle(opts) {
      this.sidebar.toggle(opts);
    }
  }]);

  return _class;
}(HTMLElement));

},{"../core/sidebar":1}]},{},[2])(2)
});