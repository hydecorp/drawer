"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseObservablesMixin = void 0;

var _esm = require("rxjs/_esm5");

var _operators = require("rxjs/_esm5/operators");

var _operators2 = require("./operators");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// Using shorthands for common functions
var abs = Math.abs.bind(Math); // #### Get start observable
// The following function returns an observable of all "start" events.
// Usually, that's just `touchstart` event of the first finger touching the screen,
// however since the compontent also supports mouse events,
// we may listen for `mousedown` events.

var baseObservablesMixin = function baseObservablesMixin(C) {
  return /*#__PURE__*/function (_C) {
    _inherits(_class, _C);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "getStartObservable",
      value: function getStartObservable() {
        // Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.
        return (0, _esm.combineLatest)(this.subjects.document, this.subjects.touchEvents, this.subjects.mouseEvents).pipe((0, _operators.switchMap)(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              document = _ref2[0],
              touchEvents = _ref2[1],
              mouseEvents = _ref2[2];

          // The touchstart observable is passive since we won't be calling `preventDefault`.
          // Also, we're only interested in the first `touchstart`.
          var touchstart$ = touchEvents ? (0, _esm.fromEvent)(document, "touchstart", {
            passive: true
          }).pipe((0, _operators.filter)(function (_ref3) {
            var touches = _ref3.touches;
            return touches.length === 1;
          }), (0, _operators.map)(function (_ref4) {
            var touches = _ref4.touches;
            return touches[0];
          })) : _esm.NEVER; // Otherwise we also include `mousedown` events in the output.

          var mousedown$ = mouseEvents ? (0, _esm.fromEvent)(document, "mousedown").pipe((0, _operators.tap)(function (event) {
            return event.event = event, event;
          })) : _esm.NEVER;
          return (0, _esm.merge)(touchstart$, mousedown$);
        }));
      } // #### Get move observable
      // This function returns an observable of all move events. Usually that's just `touchmove`,
      // but may also include `mousemove` events while the mouse button is down.

    }, {
      key: "getMoveObservable",
      value: function getMoveObservable(start$, end$) {
        // Since the `mouseEvents` or `preventDefault` option may change at any point,
        // we `switchMap` to reflect the changes.
        // Nice: `combineLatest` provides us with the functionality of emitting
        // when either of the inputs change, but not before all inputs have their first value set.
        return (0, _esm.combineLatest)(this.subjects.document, this.subjects.touchEvents, this.subjects.mouseEvents, this.subjects.preventDefault).pipe((0, _operators.switchMap)(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 4),
              document = _ref6[0],
              touchEvents = _ref6[1],
              mouseEvents = _ref6[2],
              preventDefault = _ref6[3];

          // We're only keeping track of the first finger.
          // Should the user remove the finger that started the interaction, we use the next instead.
          // Note that this doesn't occur under normal circumstances,
          // and exists primarliy to ensure that the interaction continues without hiccups.
          // Note that the event listener is only passive when the `preventDefault` option is falsy.
          var touchmove$ = touchEvents ? (0, _esm.fromEvent)(document, "touchmove", {
            passive: !preventDefault
          }).pipe((0, _operators.map)(function (e) {
            return e.touches[0].event = e, e.touches[0];
          })) : _esm.NEVER; // Otherwise we listen for `mousemove` events,
          // but only those between a `start` and `end` event, i.e. while the user is sliding.
          // We unsubscribe form the source observable outside of those contraints.
          // Again, the listener is only marked as passive when the `preventDefault` option is falsy.

          var mousemove$ = mouseEvents ? (0, _esm.fromEvent)(document, "mousemove", {
            passive: !preventDefault
          }).pipe((0, _operators2.subscribeWhen)((0, _esm.merge)(start$.pipe((0, _operators.mapTo)(true)), end$.pipe((0, _operators.mapTo)(false)))), (0, _operators.tap)(function (event) {
            return event.event = event, event;
          })) : _esm.NEVER;
          return (0, _esm.merge)(touchmove$, mousemove$);
        }));
      } // #### Get end observable
      // This function returns an observable of end events.
      // Usually, this is the `touchend` event of the last finger, but may also include `mouseup` events,
      // when the `mouseEvents` option is enabled.

    }, {
      key: "getEndObservable",
      value: function getEndObservable() {
        // Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.
        return (0, _esm.combineLatest)(this.subjects.document, this.subjects.touchEvents, this.subjects.mouseEvents).pipe((0, _operators.switchMap)(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 3),
              document = _ref8[0],
              touchEvents = _ref8[1],
              mouseEvents = _ref8[2];

          // We're only interested in the last `touchend`.
          // Otherwise there's at least one finger left on the screen,
          // that can be used to slide the drawer.
          var touchend$ = touchEvents ? (0, _esm.fromEvent)(document, "touchend", {
            passive: true
          }).pipe((0, _operators.filter)(function (_ref9) {
            var touches = _ref9.touches;
            return touches.length === 0;
          }), (0, _operators.map)(function (event) {
            return event.changedTouches[0];
          })) : _esm.NEVER; // Otherwise we include `mouseup` events.

          var mouseup$ = mouseEvents ? (0, _esm.fromEvent)(document, "mouseup", {
            passive: true
          }) : _esm.NEVER;
          return (0, _esm.merge)(touchend$, mouseup$);
        }));
      } // #### Get "Is sliding?" observable
      // An observable that emits `true` when the user is *sliding* the drawer,
      // (i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
      // (i.e. moving the finger along the y-axis).

    }, {
      key: "getIsSlidingObservable",
      value: function getIsSlidingObservable(move$, start$, end$) {
        return this.getIsSlidingObservable2(move$, start$).pipe((0, _operators.take)(1), (0, _operators.startWith)(undefined), (0, _operators.repeatWhen)(function () {
          return end$;
        }));
      }
    }, {
      key: "getIsSlidingObservable2",
      value: function getIsSlidingObservable2(move$, start$) {
        var _this = this;

        // If the threshold options is set, we delay the decision until
        // the finger has moved at least `threshold` pixels in either direction.
        if (this.threshold) {
          return move$.pipe((0, _operators.withLatestFrom)(start$), (0, _operators.skipWhile)(function (_ref10) {
            var _ref11 = _slicedToArray(_ref10, 2),
                _ref11$ = _ref11[0],
                clientX = _ref11$.clientX,
                clientY = _ref11$.clientY,
                _ref11$2 = _ref11[1],
                startX = _ref11$2.clientX,
                startY = _ref11$2.clientY;

            return abs(startY - clientY) < _this.threshold && abs(startX - clientX) < _this.threshold;
          }), (0, _operators.map)(function (_ref12) {
            var _ref13 = _slicedToArray(_ref12, 2),
                _ref13$ = _ref13[0],
                clientX = _ref13$.clientX,
                clientY = _ref13$.clientY,
                _ref13$2 = _ref13[1],
                startX = _ref13$2.clientX,
                startY = _ref13$2.clientY;

            return abs(startX - clientX) >= abs(startY - clientY);
          })); // If the threshold option is set to `0` (or `false`) we make a decision immediately.
          // This is intended for Safari and possibly other browsers that have a built-in threshold.
          // Additionally, Safari ignores all calls to `preventDefault`, except on the first move event
          // after a start event, so that we *have to* make a decision immediately.
        } else {
          return move$.pipe((0, _operators.withLatestFrom)(start$), (0, _operators.map)(function (_ref14) {
            var _ref15 = _slicedToArray(_ref14, 2),
                _ref15$ = _ref15[0],
                clientX = _ref15$.clientX,
                clientY = _ref15$.clientY,
                event = _ref15$.event,
                _ref15$2 = _ref15[1],
                startX = _ref15$2.clientX,
                startY = _ref15$2.clientY;

            var isSliding = abs(startX - clientX) >= abs(startY - clientY);
            if (_this.preventDefault && isSliding) event.preventDefault();
            return isSliding;
          }));
        }
      }
    }]);

    return _class;
  }(C);
};

exports.baseObservablesMixin = baseObservablesMixin;