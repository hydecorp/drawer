"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Set", {
  enumerable: true,
  get: function get() {
    return _component.Set;
  }
});
exports.drawerMixin = exports.MIXIN_FEATURE_TESTS = void 0;

var _component = require("hy-component/src/component");

var _rxjs = require("hy-component/src/rxjs");

var _types = require("hy-component/src/types");

var _esm = require("rxjs/_esm5");

var _setup = require("./setup");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// A set of [Modernizr] tests that are required for this component to work.
var MIXIN_FEATURE_TESTS = new _component.Set([].concat(_toConsumableArray(_component.COMPONENT_FEATURE_TESTS), ["eventlistener", "queryselector", "requestanimationframe", "classlist", "opacity", "csstransforms", "csspointerevents"]));
exports.MIXIN_FEATURE_TESTS = MIXIN_FEATURE_TESTS;

// ## Drawer Mixin
var drawerMixin = function drawerMixin(C) {
  return /*#__PURE__*/function (_setupObservablesMixi) {
    _inherits(_class, _setupObservablesMixi);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "setupComponent",
      // ### Setup
      // Overriding the setup function.
      value: function setupComponent(el, props) {
        _get(_getPrototypeOf(_class.prototype), "setupComponent", this).call(this, el, props);

        this.animateTo$ = new _esm.Subject(); // Cache DOM elements.

        this.scrimEl = this.sroot.querySelector(".hy-drawer-scrim");
        this.contentEl = this.sroot.querySelector(".hy-drawer-content"); // Set the initial alignment class.

        this.contentEl.classList.add("hy-drawer-".concat(this.align));
      } // Calling the [setup observables function](./setup.md) function.

    }, {
      key: "connectComponent",
      value: function connectComponent() {
        this.setupObservables(); // TODO: meh..

        _get(_getPrototypeOf(_class.prototype), "connectComponent", this).call(this);
      } // ### Methods
      // Public methods of this component. See [Methods](../../methods.md) for more.

    }, {
      key: "open",
      value: function open() {
        var animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (animated) this.animateTo$.next(true);else this.opened = true;
      }
    }, {
      key: "close",
      value: function close() {
        var animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (animated) this.animateTo$.next(false);else this.opened = false;
      }
    }, {
      key: "toggle",
      value: function toggle() {
        var animated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (animated) this.animateTo$.next(!this.opened);else this.opened = !this.opened;
      }
    }], [{
      key: "componentName",
      // The name of the component (required by hy-component)
      get: function get() {
        return "hy-drawer";
      } // ### Options
      // The default values (and types) of the configuration options (required by hy-component)
      // See [Options](../../options.md) for usage information.

    }, {
      key: "types",
      get: function get() {
        return {
          opened: _types.bool,
          align: (0, _types.oneOf)(["left", "right"]),
          persistent: _types.bool,
          range: (0, _types.arrayOf)(_types.number),
          threshold: _types.number,
          preventDefault: _types.bool,
          touchEvents: _types.bool,
          mouseEvents: _types.bool
        };
      }
    }, {
      key: "defaults",
      get: function get() {
        return {
          opened: false,
          align: "left",
          persistent: false,
          range: [0, 100],
          threshold: 10,
          preventDefault: false,
          touchEvents: false,
          mouseEvents: false
        };
      }
    }]);

    return _class;
  }((0, _setup.setupObservablesMixin)((0, _rxjs.rxjsMixin)((0, _component.componentMixin)(C))));
}; // [rxjs]: https://github.com/ReactiveX/rxjs
// [esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
// [modernizr]: https://modernizr.com/


exports.drawerMixin = drawerMixin;