"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupObservablesMixin = void 0;

var _esm = require("rxjs/_esm5");

var _operators = require("rxjs/_esm5/operators");

var _rxjsCreateTween = require("rxjs-create-tween");

var _rxjs = require("hy-component/src/rxjs");

var _common = require("../common");

var _constants = require("./constants");

var _operators2 = require("./operators");

var _calc = require("./calc");

var _update = require("./update");

var _observables = require("./observables");

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

// ### Setup observables
// This function sets up the observable "pipeline".
var setupObservablesMixin = function setupObservablesMixin(C) {
  return /*#__PURE__*/function (_baseObservablesMixin) {
    _inherits(_class, _baseObservablesMixin);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "setupObservables",
      value: function setupObservables() {
        var _this = this;

        var initialRect = {
          contentRect: this.contentEl.getBoundingClientRect()
        };
        var resize$ = "ResizeObserver" in window ? (0, _rxjs.createXObservable)(ResizeObserver)(this.contentEl).pipe((0, _operators.startWith)(initialRect)) : (0, _esm.of)(initialRect);
        var drawerWidth$ = resize$.pipe((0, _operators.takeUntil)(this.subjects.disconnect), (0, _operators.map)(function (_ref) {
          var contentRect = _ref.contentRect;
          return contentRect.width;
        }), (0, _operators.share)(), (0, _operators.startWith)(initialRect.contentRect.width)); // HACK: peek feature has been removed, but still needed for hydejack...

        if (
        /* process.env.HYDEJACK && */
        this._peek$) {
          drawerWidth$ = (0, _esm.combineLatest)(drawerWidth$, this._peek$).pipe((0, _operators.map)(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                drawerWidth = _ref3[0],
                peek = _ref3[1];

            return drawerWidth - peek;
          }));
        } // Emitts a value every time you change the `persistent` property of the drawer.
        // Interally, we invert it and call it `active`.


        var active$ = this.subjects.persistent.pipe((0, _operators.map)(function (x) {
          return !x;
        })); // #### Start observable
        // Emits a value every time a start event *could* intiate an interaction.
        // Each emitted value is a hash containing a `clientX` and `clientY` key.

        var start$ = this.getStartObservable().pipe((0, _operators.takeUntil)(this.subjects.disconnect), (0, _operators2.filterWhen)(active$), (0, _operators.share)()); // An observable that emits `true`, as long as the drawer isn't fully closed
        // (as long as the scrim is visible the user can still "catch" the drawer).
        // It references the yet-to-be-defined `translateX` obsevable, so we wrap it inside a `defer`.

        var isScrimVisible$ = (0, _esm.defer)(function () {
          return _this.translateX$.pipe((0, _operators.map)(function (translateX) {
            return translateX != 0;
          }));
        }); // TODO: ...

        var isInRange$ = start$.pipe((0, _operators.withLatestFrom)(isScrimVisible$), (0, _operators.map)(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
              clientX = _ref5[0].clientX,
              isScrimVisible = _ref5[1];

          return _this.calcIsInRange(clientX, isScrimVisible);
        }), (0, _operators.tap)(function (inRange) {
          if (inRange) {
            if (_this.mouseEvents) _this.contentEl.classList.add("hy-drawer-grabbing");

            _this.prepareInteraction();
          }
        }), (0, _operators.share)()); // #### End observable
        // The observable of all relevant "end" events, i.e. the last `touchend` (or `mouseup`),

        var end$ = this.getEndObservable().pipe((0, _operators.takeUntil)(this.subjects.disconnect), (0, _operators2.filterWhen)(active$, isInRange$), (0, _operators.share)()); // #### Move observable
        // The observable of all relevant "move" events.

        var move$ = this.getMoveObservable(start$, end$).pipe((0, _operators.takeUntil)(this.subjects.disconnect), (0, _operators2.filterWhen)(active$, isInRange$), (0, _operators.share)()); // #### 'Is sliding?' observable
        // An observable that emits `true` when the user is *sliding* the drawer,
        // (i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
        // (i.e. moving the finger along the y-axis), and `undefined` while we aren't sure yet.
        //
        // See [`getIsSlidingObservable`](./observables.md#get-is-sliding-observable).

        var isSliding$ = this.getIsSlidingObservable(move$, start$, end$).pipe((0, _operators.tap)(function (isSliding) {
          if (isSliding) _this.fireEvent("slidestart", {
            detail: _this.opened
          });
        })); // #### Translate X observable
        // The `translateX` observable is the central observable of this component.
        // It emits the current x-coordinate of the drawer, which
        // can be modified by either of 3 incoming observables:
        //
        // 1. the animation/tween observable, and
        // 2. The move observable (the user's finger/mouse moving across the screen),
        // 3. direct modifications of the `opened` state.
        //
        // It is wrapped in a `defer` because it depends on previous values of itself.

        this.translateX$ = (0, _esm.defer)(function () {
          return (0, _esm.merge)( // 1)
          // The tween observable can be used unmodified (see below),
          // but isn't defined yet, because it depends on previous values of `translateX$`.
          _this.tween$, // 2)
          // We only let move events modify the drawer's position when we are sure
          // that the user is sliding. In case the `preventDefault` option is enabled,
          // this is also when we're sure to call `preventDefault`.
          move$.pipe((0, _operators2.filterWhen)(isSliding$), (0, _operators.tap)(function (_ref6) {
            var event = _ref6.event;
            return _this.preventDefault && event.preventDefault();
          }), // Finally, we take the start position of the finger, the start position of the drawer,
          // and the current position of the finger to calculate the next `translateX` value.
          (0, _operators.withLatestFrom)(start$, _this.startTranslateX$, drawerWidth$), (0, _operators.observeOn)(_esm.animationFrameScheduler), (0, _operators.map)(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 4),
                clientX = _ref8[0].clientX,
                startX = _ref8[1].clientX,
                startTranslateX = _ref8[2],
                drawerWidth = _ref8[3];

            return _this.calcTranslateX(clientX, startX, startTranslateX, drawerWidth);
          })), // 3)
          // When the `opened` state changes, we "jump" to the new position,
          // which is either 0 (when closed) or the width of the drawer (when open).
          (0, _esm.combineLatest)(_this.subjects.opened, _this.subjects.align, drawerWidth$).pipe( // Usually the cleanup code would run at the end of the fling animation,
          // but since there is no animation in this case, we call it directly.
          (0, _operators.tap)(function (_ref9) {
            var _ref10 = _slicedToArray(_ref9, 1),
                opened = _ref10[0];

            return _this.cleanupInteraction(opened);
          }), (0, _operators.map)(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 3),
                opened = _ref12[0],
                align = _ref12[1],
                drawerWidth = _ref12[2];

            return !opened ? 0 : drawerWidth * (align === "left" ? 1 : -1);
          })));
        }) // `share`ing the observable between many subscribers:
        .pipe((0, _operators.takeUntil)(this.subjects.disconnect), (0, _operators.share)()); // The `translateX` value at the start of an interaction.
        // Typically this would be either 0 or `drawerWidth`, but since the user can initiate
        // an interaction *during the animation*, it could also be any value inbetween.
        // We obtain it by sampling the translate-x observable at the beginning of each interaction.

        this.startTranslateX$ = this.translateX$.pipe((0, _operators.sample)(start$)); // #### Tween observable
        // For the tween animations we first need an observable that tracks
        // the current velocity of the drawer,
        // which we will use to determine whether the drawer should flinging in its direction,
        // or snap back into place.

        var velocity$ = this.translateX$.pipe((0, _operators.timestamp)(), (0, _operators.pairwise)(), // Since we are at the mercy of the browser firing move events,
        // we make sure that some time has passed since the last move event.
        (0, _operators.filter)(function (_ref13) {
          var _ref14 = _slicedToArray(_ref13, 2),
              prevTime = _ref14[0].timestamp,
              time = _ref14[1].timestamp;

          return time - prevTime > 0;
        }), // Now we are save to calculate the current velocity without divide by zero errors.
        (0, _operators.map)(function (_ref15) {
          var _ref16 = _slicedToArray(_ref15, 2),
              _ref16$ = _ref16[0],
              prevX = _ref16$.value,
              prevTime = _ref16$.timestamp,
              _ref16$2 = _ref16[1],
              x = _ref16$2.value,
              time = _ref16$2.timestamp;

          return (x - prevX) / (time - prevTime);
        }), // The initial velocity is zero.
        (0, _operators.startWith)(0)); // TODO

        var willOpen$ = end$.pipe((0, _operators.tap)(function () {
          return _this.contentEl.classList.remove("hy-drawer-grabbing");
        }), (0, _operators.withLatestFrom)(start$, this.translateX$, drawerWidth$, velocity$), (0, _operators.filter)(this.calcIsSwipe.bind(this)), (0, _operators.map)(this.calcWillOpen.bind(this)), // TODO: only fire `slideend` event when slidestart fired as well?
        (0, _operators.tap)(function (willOpen) {
          return _this.fireEvent("slideend", {
            detail: willOpen
          });
        })); // There are 2 things that can trigger an animation:
        // 1. The end of an interaction, i.e. the user releases the finger/mouse while moving the slider.
        // 2. A call to a method like `open` or `close` (represented by a value on the animate observable)
        //    Note that we call `prepareInteraction` manually here, because it wasn't triggered by a
        //    prior `touchdown`/`mousedown` event in this case.

        var willOpen2$ = (0, _esm.merge)(willOpen$, this.animateTo$.pipe((0, _operators.tap)(this.prepareInteraction.bind(this)))); // We silently set the new `opened` state here,
        // so that the next interaction will do the right thing even while the animation is
        // still playing, e.g. a call to `toggle` will cancel the current animation
        // and initiate an animation to the opposite state.

        this.tween$ = willOpen2$.pipe((0, _operators.tap)(function (willOpen) {
          return _this.setInternalState("opened", willOpen);
        }), // By using `switchMap` we ensure that subsequent events that trigger an animation
        // don't cause more than one animation to be played at a time.
        (0, _operators.withLatestFrom)(this.translateX$, drawerWidth$), (0, _operators.switchMap)(function (_ref17) {
          var _ref18 = _slicedToArray(_ref17, 3),
              opened = _ref18[0],
              translateX = _ref18[1],
              drawerWidth = _ref18[2];

          // We return a tween observable that runs cleanup code when it completes
          // --- unless a new interaction is initiated, in which case it is canceled.
          var inv = _this.align === "left" ? 1 : -1;
          var endTranslateX = opened ? drawerWidth * inv : 0;
          var diffTranslateX = endTranslateX - translateX;
          var duration = _constants.BASE_DURATION + drawerWidth * _constants.WIDTH_CONTRIBUTION;
          return (0, _rxjsCreateTween.createTween)(_common.easeOutSine, translateX, diffTranslateX, duration).pipe((0, _operators.tap)({
            complete: function complete() {
              return _this.subjects.opened.next(opened);
            }
          }), (0, _operators.takeUntil)(start$), (0, _operators.takeUntil)(_this.subjects.align.pipe((0, _operators.skip)(1))), (0, _operators.share)());
        })); // #### Subscriptions
        // Now we are ready to cause some side effects.
        //
        // The end result is always to update the (shadow) DOM, which happens here.
        // Note that the call to subscribe sets the whole process in motion,
        // and causes the code inside the above `defer` observables to run.

        this.translateX$.pipe((0, _operators.withLatestFrom)(drawerWidth$)).subscribe(function (_ref19) {
          var _ref20 = _slicedToArray(_ref19, 2),
              translateX = _ref20[0],
              drawerWidth = _ref20[1];

          return _this.updateDOM(translateX, drawerWidth);
        }); // A click on the scrim should close the drawer.

        (0, _esm.fromEvent)(this.scrimEl, "click").pipe((0, _operators.takeUntil)(this.subjects.disconnect)).subscribe(function () {
          return _this.close();
        }); // Other than preventing sliding, setting `persistent` will also hide the scrim.

        active$.pipe((0, _operators.takeUntil)(this.subjects.disconnect)).subscribe(function (active) {
          _this.scrimEl.style.display = active ? "block" : "none";
        }); // Whenever the alignment of the drawer changes, update the CSS classes.

        this.subjects.align.pipe((0, _operators.takeUntil)(this.subjects.disconnect)).subscribe(function (align) {
          _this.contentEl.classList.remove("hy-drawer-left");

          _this.contentEl.classList.remove("hy-drawer-right");

          _this.contentEl.classList.add("hy-drawer-".concat(align));
        }); // If the experimental back button feature is enabled, handle popstate events...

        /*
        fromEvent(window, "popstate")
          .pipe(
            takeUntil(this.subjects.disconnect),
            subscribeWhen(this.backButton$)
          )
          .subscribe(() => {
            const hash = `#${histId.call(this)}--opened`;
            const willOpen = window.location.hash === hash;
            if (willOpen !== this.opened) this.animateTo$.next(willOpen);
          });
        */
        // When drawing with mouse is enabled, we add the grab cursor to the drawer.
        // We also want to call `preventDefault` when `mousedown` is within the drawer range
        // to prevent text selection while sliding.

        this.subjects.mouseEvents.pipe((0, _operators.takeUntil)(this.subjects.disconnect), (0, _operators.switchMap)(function (mouseEvents) {
          if (mouseEvents) _this.contentEl.classList.add("hy-drawer-grab");else _this.contentEl.classList.remove("hy-drawer-grab");
          return mouseEvents ? start$.pipe((0, _operators.withLatestFrom)(isInRange$)) : _esm.NEVER;
        })).subscribe(function (_ref21) {
          var _ref22 = _slicedToArray(_ref21, 2),
              event = _ref22[0].event,
              isInRange = _ref22[1];

          return isInRange && event && event.preventDefault();
        }); // If the experimental back button feature is enabled, we check the location hash...

        /*
        if (this._backButton) {
          const hash = `#${histId.call(this)}--opened`;
          if (window.location.hash === hash) this.setInternalState('opened', true);
        }
        */
        // Firing an event to let the outside world know the drawer is ready.

        this.fireEvent("init", {
          detail: this.opened
        });
      }
    }]);

    return _class;
  }((0, _observables.baseObservablesMixin)((0, _update.updateMixin)((0, _calc.calcMixin)(C))));
};

exports.setupObservablesMixin = setupObservablesMixin;