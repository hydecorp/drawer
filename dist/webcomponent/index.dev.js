(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("hyDrawer", [], factory);
	else if(typeof exports === 'object')
		exports["hyDrawer"] = factory();
	else
		root["hyDrawer"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _root; });
// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
var _root = __window || __global || __self;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
/*@__PURE__*/(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();

//# sourceMappingURL=root.js.map
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./node_modules/qd-set/esm/index.js
var _Set = typeof Set !== 'undefined' && new Set([1]).size === 1 ? Set : function () {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  a = a.filter(function (x, i) {
    return i === a.indexOf(x);
  });
  a.size = a.length;
  a.has = function (x) {
    return a.indexOf(x) > -1;
  };
  a.add = function (x) {
    if (!a.has(x)) {
      a.size++;a.push(x);
    }return a;
  };
  a.delete = function (x) {
    var t = void 0;if (t = a.has(x)) {
      a.size--;a.splice(a.indexOf(x), 1);
    }return t;
  };
  a.clear = function () {
    while (a.pop()) {}a.size = 0;
  };
  return a;
};


// CONCATENATED MODULE: ./node_modules/hy-component/src/common.js
// # src / common.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

/* eslint-disable no-plusplus */

function parseType(type, attr) {
  if (true && !type) {
    return console.warn("No type provided for attribute " + attr + ".");
  }
  return type ? type(attr) : attr;
}

function decamelize(str) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "-";

  return str.replace(/([a-z\d])([A-Z])/g, "$1" + sep + "$2").replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + sep + "$2").toLowerCase();
}

function preserveCamelCase(strarg) {
  var str = strarg;
  var isLastCharLower = false;
  var isLastCharUpper = false;
  var isLastLastCharUpper = false;

  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);

    if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
      str = str.substr(0, i) + "-" + str.substr(i);
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i++;
    } else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
      str = str.substr(0, i - 1) + "-" + str.substr(i - 1);
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower = c.toLowerCase() === c;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = c.toUpperCase() === c;
    }
  }

  return str;
}

function camelCase() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var str = [].map.call(args, function (x) {
    return x.trim();
  }).filter(function (x) {
    return x.length;
  }).join("-");

  if (str.length === 0) {
    return "";
  }

  if (str.length === 1) {
    return str.toLowerCase();
  }

  str = preserveCamelCase(str);

  return str.replace(/^[_.\- ]+/, "").toLowerCase().replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
    return p1.toUpperCase();
  });
}
// CONCATENATED MODULE: ./node_modules/hy-component/src/component.js
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// # src / component.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

// import 'core-js/fn/array/for-each';
// import 'core-js/fn/object/assign';
// import 'core-js/fn/object/define-property';
// import 'core-js/fn/object/keys';





var COMPONENT_FEATURE_TESTS = new _Set(["customevent"]);

var sSymbol = Symbol || function (x) {
  return "_" + x;
};
var sRoot = sSymbol("sroot");
var sState = sSymbol("state");

window.process = window.process || {};
window.process.env = window.process.env || {};

window.requestIdleCallback = window.requestIdleCallback || function (f) {
  return window.setTimeout(f, 0);
};
window.cancelIdleCallback = window.cancelIdleCallback || window.clearTimeout;

var Component = function Component() {
  _classCallCheck(this, Component);
};

var componentMixin = function componentMixin() {
  var C = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Component;
  return function (_C) {
    _inherits(_class, _C);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: "setupComponent",
      value: function setupComponent(el, state) {
        var defaults = this.constructor.defaults;


        if (true) {
          var _constructor = this.constructor,
              componentName = _constructor.componentName,
              sideEffects = _constructor.sideEffects;

          if (!componentName) {
            console.warn("Component needs to have a name, e.g. `my-tag`. To set a name, provide a static getter called `componentName`.");
          }
          if (!defaults) {
            console.warn("No default properties provided. Implement a static getter called `defaults`.");
          }
          if (!sideEffects) {
            console.warn("No side effects provided. Implement a static getter called `sideEffects`.");
          }
        }

        this[sState] = Object.assign({}, defaults, state);
        this.setupProperties(this);
        this[sRoot] = this.setupShadowDOM(el);
      }
    }, {
      key: "setupShadowDOM",
      value: function setupShadowDOM(el) {
        return el;
      }
    }, {
      key: "connectComponent",
      value: function connectComponent() {}
    }, {
      key: "disconnectComponent",
      value: function disconnectComponent() {}
    }, {
      key: "adoptComponent",
      value: function adoptComponent() {}
    }, {
      key: "getRoot",
      value: function getRoot() {
        return this[sRoot];
      }
    }, {
      key: "getEl",
      value: function getEl() {
        return this[sRoot];
      }
    }, {
      key: "fireEvent",
      value: function fireEvent(eventName, data) {
        var componentName = this.constructor.componentName;

        var event = new CustomEvent(componentName + "-" + eventName, data);
        this.el.dispatchEvent(event);
      }
    }, {
      key: "setInternalState",
      value: function setInternalState(key, value) {
        this[sState][key] = value;
      }
    }, {
      key: "setupProperties",
      value: function setupProperties() {
        var _this2 = this;

        var sideEffects = this.constructor.sideEffects;


        Object.keys(this[sState]).forEach(function (key) {
          var sideEffect = sideEffects[key];
          _this2.setupProperty(key, sideEffect);
        });
      }
    }, {
      key: "setupProperty",
      value: function setupProperty(key, sideEffect) {
        var _this3 = this;

        Object.defineProperty(this, key, {
          get: function get() {
            return _this3[sState][key];
          },
          set: function set(value) {
            var oldValue = _this3[sState][key];
            _this3.setInternalState(key, value);
            if (sideEffect) sideEffect.call(_this3, value, oldValue);
          },
          enumerable: true,
          configurable: true
        });
      }
    }, {
      key: "sroot",
      get: function get() {
        return this.getRoot();
      }
    }, {
      key: "el",
      get: function get() {
        return this.getEl();
      }
    }]);

    return _class;
  }(C);
};
// CONCATENATED MODULE: ./node_modules/hy-component/src/custom-element.js
var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var custom_element__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function custom_element__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function custom_element__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function custom_element__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// # src / custom-element.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

// import 'core-js/fn/array/for-each';
// import 'core-js/fn/array/from';
// import 'core-js/fn/array/map';
// import 'core-js/fn/number/constructor';
// import 'core-js/fn/object/keys';
// import 'core-js/fn/object/set-prototype-of';
// import 'core-js/fn/reflect/construct';
// import 'core-js/fn/string/trim'; // used by camelcase








var CUSTOM_ELEMENT_FEATURE_TESTS = new _Set([].concat(_toConsumableArray(COMPONENT_FEATURE_TESTS), ["template", "customelements"]));

var circutBreaker = null;

var custom_element_customElementMixin = function customElementMixin(C) {
  return function (_C) {
    custom_element__inherits(_class, _C);

    custom_element__createClass(_class, null, [{
      key: "getObservedAttributes",
      value: function getObservedAttributes() {
        var types = this.types;

        return Object.keys(types).map(function (x) {
          return decamelize(x);
        });
      }
    }]);

    function _class() {
      var _ref;

      custom_element__classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = custom_element__possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

      _this.setupComponent(_this, _this.getStateFromAttributes());
      return _this;
    }

    custom_element__createClass(_class, [{
      key: "reflectAttribute",
      value: function reflectAttribute(key, val) {
        var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var attrName = decamelize(key);

        if (silent) circutBreaker = attrName;

        var types = this.constructor.types;

        var type = types[key];

        if (true && (!type || !type.stringify)) {
          console.warn("No type provided for key '" + key + "'");
        }

        var attr = type.stringify(val);

        if (attr == null) {
          this.removeAttribute(attrName);
        } else {
          this.setAttribute(attrName, attr);
        }
      }

      /*
      reflectAttributes() {
        const { types } = this.constructor;
        Object.keys(types).forEach(key => this.reflectAttribute(key, this[key], true));
      }
      */

    }, {
      key: "getStateFromAttributes",
      value: function getStateFromAttributes() {
        var _this2 = this;

        var types = this.constructor.types;


        var state = {};
        Object.keys(types).forEach(function (key) {
          var attrName = decamelize(key);
          var attr = _this2.hasAttribute(attrName) ? _this2.getAttribute(attrName) : null;
          var value = parseType(types[key], attr);
          if (value != null) state[key] = value;
        });

        return state;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        /* this.reflectAttributes(); */
        this.connectComponent();
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this.disconnectComponent();
      }
    }, {
      key: "adoptedCallback",
      value: function adoptedCallback() {
        this.adoptComponent();
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(attrName, oldAttr, attr) {
        if (circutBreaker === attrName) circutBreaker = null;else if (oldAttr !== attr) {
          var types = this.constructor.types;


          var key = camelCase(attrName);
          var value = parseType(types[key], attr);

          this[key] = value != null ? value : this.constructor.defaults[key];
        }
      }
    }, {
      key: "setInternalState",
      value: function setInternalState(key, value) {
        _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "setInternalState", this).call(this, key, value);
        this.reflectAttribute(key, value, true);
      }
    }, {
      key: "setupShadowDOM",
      value: function setupShadowDOM(el) {
        var instance = this.getTemplate();
        if (instance) {
          if ("attachShadow" in Element.prototype) {
            el.attachShadow({ mode: "open" });
            el.shadowRoot.appendChild(instance);
            return el.shadowRoot;
          }
          if (true) console.warn("Component doesnt define a template. Intentional?");
          throw Error("ShadowDOM API not supported");
        }
        return el;
      }
    }, {
      key: "getEl",
      value: function getEl() {
        return this;
      }
    }, {
      key: "getTemplate",
      value: function getTemplate() {
        var componentName = this.constructor.componentName;

        return document.querySelector("link[href*=\"" + componentName + "\"]").import.querySelector("#" + componentName + "-template").content.cloneNode(true);
      }
    }, {
      key: "template",
      get: function get() {
        return this.getTemplate();
      }
    }]);

    return _class;
  }(C);
};

// This is a drop-in replacement for `HTMLElement` which is compatible with babel.
function CustomElement() {
  var HTMLElement = typeof window.HTMLElement === "function" ? window.HTMLElement : function () {};
  return Reflect.construct(HTMLElement, [], this.__proto__.constructor); // eslint-disable-line
}

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(CustomElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(CustomElement, HTMLElement);
}

// TODO
function fragmentFromString(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}
// EXTERNAL MODULE: ./node_modules/rxjs/_esm5/util/root.js
var root = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/isFunction.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
    return typeof x === 'function';
}
//# sourceMappingURL=isFunction.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/isArray.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = Array.isArray || function (x) {
  return x && typeof x.length === 'number';
};
//# sourceMappingURL=isArray.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/isObject.js
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
    return x != null && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object';
}
//# sourceMappingURL=isObject.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/errorObject.js
// typeof any so that it we don't have to cast when comparing a result to the error object
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/tryCatch.js
/** PURE_IMPORTS_START ._errorObject PURE_IMPORTS_END */

var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    } catch (e) {
        errorObject.e = e;
        return errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
;
//# sourceMappingURL=tryCatch.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/UnsubscriptionError.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var __extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ? errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) {
            return i + 1 + ") " + err.toString();
        }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error);
//# sourceMappingURL=UnsubscriptionError.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/Subscription.js
var Subscription__typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** PURE_IMPORTS_START ._util_isArray,._util_isObject,._util_isFunction,._util_tryCatch,._util_errorObject,._util_UnsubscriptionError PURE_IMPORTS_END */






/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription_Subscription = /*@__PURE__*/ /*@__PURE__*/function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this,
            _parent = _a._parent,
            _parents = _a._parents,
            _unsubscribe = _a._unsubscribe,
            _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction(_unsubscribe)) {
            var trial = tryCatch(_unsubscribe).call(this);
            if (trial === errorObject) {
                hasErrors = true;
                errors = errors || (errorObject.e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
            }
        }
        if (isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject(sub)) {
                    var trial = tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject.e;
                        if (err instanceof UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        } else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || teardown === Subscription.EMPTY) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown === 'undefined' ? 'undefined' : Subscription__typeof(teardown)) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                } else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                } else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this,
            _parent = _a._parent,
            _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        } else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        } else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription());
    return Subscription;
}();
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) {
        return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
    }, []);
}
//# sourceMappingURL=Subscription.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/Observer.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var empty = {
    closed: true,
    next: function next(value) {},
    error: function error(err) {
        throw err;
    },
    complete: function complete() {}
};
//# sourceMappingURL=Observer.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/symbol/rxSubscriber.js
/** PURE_IMPORTS_START .._util_root PURE_IMPORTS_END */

var _Symbol = root["a" /* root */].Symbol;
var rxSubscriber = typeof _Symbol === 'function' && typeof _Symbol.for === 'function' ?
/*@__PURE__*/_Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
var $$rxSubscriber = rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/Subscriber.js
var Subscriber__typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** PURE_IMPORTS_START ._util_isFunction,._Subscription,._Observer,._symbol_rxSubscriber PURE_IMPORTS_END */
var Subscriber___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber_Subscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    Subscriber___extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = empty;
                    break;
                }
                if ((typeof destinationOrNext === 'undefined' ? 'undefined' : Subscriber__typeof(destinationOrNext)) === 'object') {
                    // HACK(benlesh): To resolve an issue where Node users may have multiple
                    // copies of rxjs in their node_modules directory.
                    if (isTrustedSubscriber(destinationOrNext)) {
                        var trustedSubscriber = destinationOrNext[rxSubscriber]();
                        this.syncErrorThrowable = trustedSubscriber.syncErrorThrowable;
                        this.destination = trustedSubscriber;
                        trustedSubscriber.add(this);
                    } else {
                        this.syncErrorThrowable = true;
                        this.destination = new Subscriber_SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new Subscriber_SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber] = function () {
        return this;
    };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    /** @deprecated internal use only */Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this,
            _parent = _a._parent,
            _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_Subscription);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var Subscriber_SafeSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    Subscriber___extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction(observerOrNext)) {
            next = observerOrNext;
        } else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== empty) {
                context = Object.create(observerOrNext);
                if (isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                } else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            } else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            } else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function wrappedComplete() {
                    return _this._complete.call(_this._context);
                };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                } else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            } else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        } catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        } catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    /** @deprecated internal use only */SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber_Subscriber);
function isTrustedSubscriber(obj) {
    return obj instanceof Subscriber_Subscriber || 'syncErrorThrowable' in obj && obj[rxSubscriber];
}
//# sourceMappingURL=Subscriber.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/toSubscriber.js
/** PURE_IMPORTS_START .._Subscriber,.._symbol_rxSubscriber,.._Observer PURE_IMPORTS_END */



function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber]) {
            return nextOrObserver[rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_Subscriber(empty);
    }
    return new Subscriber_Subscriber(nextOrObserver, error, complete);
}
//# sourceMappingURL=toSubscriber.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/symbol/observable.js
/** PURE_IMPORTS_START .._util_root PURE_IMPORTS_END */

function getSymbolObservable(context) {
    var $$observable;
    var _Symbol = context.Symbol;
    if (typeof _Symbol === 'function') {
        if (_Symbol.observable) {
            $$observable = _Symbol.observable;
        } else {
            $$observable = _Symbol('observable');
            _Symbol.observable = $$observable;
        }
    } else {
        $$observable = '@@observable';
    }
    return $$observable;
}
var observable_observable = /*@__PURE__*/getSymbolObservable(root["a" /* root */]);
/**
 * @deprecated use observable instead
 */
var $$observable = observable_observable;
//# sourceMappingURL=observable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/noop.js
/* tslint:disable:no-empty */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function noop() {}
//# sourceMappingURL=noop.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/pipe.js
/** PURE_IMPORTS_START ._noop PURE_IMPORTS_END */

/* tslint:enable:max-line-length */
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i - 0] = arguments[_i];
    }
    return pipeFromArray(fns);
}
/* @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) {
            return fn(prev);
        }, input);
    };
}
//# sourceMappingURL=pipe.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/Observable.js
/** PURE_IMPORTS_START ._util_root,._util_toSubscriber,._symbol_observable,._util_pipe PURE_IMPORTS_END */




/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable_Observable = /*@__PURE__*/ /*@__PURE__*/function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
     *
     * @example <caption>Subscribe with an Observer</caption>
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Subscribe with functions</caption>
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Cancel a subscription</caption>
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     *
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        } else {
            sink.add(this.source || !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        } catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root["a" /* root */].Rx && root["a" /* root */].Rx.config && root["a" /* root */].Rx.config.Promise) {
                PromiseCtor = root["a" /* root */].Rx.config.Promise;
            } else if (root["a" /* root */].Promise) {
                PromiseCtor = root["a" /* root */].Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    } catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                } else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    /** @deprecated internal use only */Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * @example
     *
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i - 0] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root["a" /* root */].Rx && root["a" /* root */].Rx.config && root["a" /* root */].Rx.config.Promise) {
                PromiseCtor = root["a" /* root */].Rx.config.Promise;
            } else if (root["a" /* root */].Promise) {
                PromiseCtor = root["a" /* root */].Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) {
                return value = x;
            }, function (err) {
                return reject(err);
            }, function () {
                return resolve(value);
            });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}();
//# sourceMappingURL=Observable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/ObjectUnsubscribedError.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ObjectUnsubscribedError___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
var ObjectUnsubscribedError = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ObjectUnsubscribedError___extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        var err = _super.call(this, 'object unsubscribed');
        this.name = err.name = 'ObjectUnsubscribedError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return ObjectUnsubscribedError;
}(Error);
//# sourceMappingURL=ObjectUnsubscribedError.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/SubjectSubscription.js
/** PURE_IMPORTS_START ._Subscription PURE_IMPORTS_END */
var SubjectSubscription___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubjectSubscription = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    SubjectSubscription___extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        _super.call(this);
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_Subscription);
//# sourceMappingURL=SubjectSubscription.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/Subject.js
/** PURE_IMPORTS_START ._Observable,._Subscriber,._Subscription,._util_ObjectUnsubscribedError,._SubjectSubscription,._symbol_rxSubscriber PURE_IMPORTS_END */
var Subject___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    Subject___extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        _super.call(this, destination);
        this.destination = destination;
    }
    return SubjectSubscriber;
}(Subscriber_Subscriber);
/**
 * @class Subject<T>
 */
var Subject_Subject = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    Subject___extends(Subject, _super);
    function Subject() {
        _super.call(this);
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    Subject.prototype[rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new Subject_AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        } else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    /** @deprecated internal use only */Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        } else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_Subscription.EMPTY;
        } else if (this.isStopped) {
            subscriber.complete();
            return Subscription_Subscription.EMPTY;
        } else {
            this.observers.push(subscriber);
            return new SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable_Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new Subject_AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable_Observable);
/**
 * @class AnonymousSubject<T>
 */
var Subject_AnonymousSubject = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    Subject___extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        _super.call(this);
        this.destination = destination;
        this.source = source;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    /** @deprecated internal use only */AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        } else {
            return Subscription_Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject_Subject);
//# sourceMappingURL=Subject.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/Action.js
/** PURE_IMPORTS_START .._Subscription PURE_IMPORTS_END */
var Action___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * A unit of work to be executed in a {@link Scheduler}. An action is typically
 * created from within a Scheduler and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
var Action = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    Action___extends(Action, _super);
    function Action(scheduler, work) {
        _super.call(this);
    }
    /**
     * Schedules this action on its parent Scheduler for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return this;
    };
    return Action;
}(Subscription_Subscription);
//# sourceMappingURL=Action.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/AsyncAction.js
/** PURE_IMPORTS_START .._util_root,._Action PURE_IMPORTS_END */
var AsyncAction___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AsyncAction_AsyncAction = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    AsyncAction___extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (this.closed) {
            return this;
        }
        // Always replace the current state with the new state.
        this.state = state;
        // Set the pending flag indicating that this action has been scheduled, or
        // has recursively rescheduled itself.
        this.pending = true;
        var id = this.id;
        var scheduler = this.scheduler;
        //
        // Important implementation note:
        //
        // Actions only execute once by default, unless rescheduled from within the
        // scheduled callback. This allows us to implement single and repeat
        // actions via the same code path, without adding API surface area, as well
        // as mimic traditional recursion but across asynchronous boundaries.
        //
        // However, JS runtimes and timers distinguish between intervals achieved by
        // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
        // serial `setTimeout` calls can be individually delayed, which delays
        // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
        // guarantee the interval callback will be invoked more precisely to the
        // interval period, regardless of load.
        //
        // Therefore, we use `setInterval` to schedule single and repeat actions.
        // If the action reschedules itself with the same delay, the interval is not
        // canceled. If the action doesn't reschedule, or reschedules with a
        // different delay, the interval will be canceled after scheduled callback
        // execution.
        //
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.delay = delay;
        // If this action has already an async Id, don't request a new one.
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return root["a" /* root */].setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // or the action has been rescheduled before it's executed, clear the interval id
        return root["a" /* root */].clearInterval(id) && undefined || undefined;
    };
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        } else if (this.pending === false && this.id != null) {
            // Dequeue if the action didn't reschedule itself. Don't call
            // unsubscribe(), because the action could reschedule later.
            // For example:
            // ```
            // scheduler.schedule(function doWork(counter) {
            //   /* ... I'm a busy worker bee ... */
            //   var originalAction = this;
            //   /* wait 100ms before rescheduling the action */
            //   setTimeout(function () {
            //     originalAction.schedule(counter + 1);
            //   }, 100);
            // }, 1000);
            // ```
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        } catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    /** @deprecated internal use only */AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(Action);
//# sourceMappingURL=AsyncAction.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/QueueAction.js
/** PURE_IMPORTS_START ._AsyncAction PURE_IMPORTS_END */
var QueueAction___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var QueueAction = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    QueueAction___extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return delay > 0 || this.closed ? _super.prototype.execute.call(this, state, delay) : this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        // Otherwise flush the scheduler starting with this action.
        return scheduler.flush(this);
    };
    return QueueAction;
}(AsyncAction_AsyncAction);
//# sourceMappingURL=QueueAction.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/Scheduler.js
/**
 * An execution context and a data structure to order tasks and schedule their
 * execution. Provides a notion of (potentially virtual) time, through the
 * `now()` getter method.
 *
 * Each unit of work in a Scheduler is called an {@link Action}.
 *
 * ```ts
 * class Scheduler {
 *   now(): number;
 *   schedule(work, delay?, state?): Subscription;
 * }
 * ```
 *
 * @class Scheduler
 */
var Scheduler = /*@__PURE__*/ /*@__PURE__*/function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    /**
     * Schedules a function, `work`, for execution. May happen at some point in
     * the future, according to the `delay` parameter, if specified. May be passed
     * some context object, `state`, which will be passed to the `work` function.
     *
     * The given arguments will be processed an stored as an Action object in a
     * queue of actions.
     *
     * @param {function(state: ?T): ?Subscription} work A function representing a
     * task, or some unit of work to be executed by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler itself.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @return {Subscription} A subscription in order to be able to unsubscribe
     * the scheduled work.
     */
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = Date.now ? Date.now : function () {
        return +new Date();
    };
    return Scheduler;
}();
//# sourceMappingURL=Scheduler.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/AsyncScheduler.js
/** PURE_IMPORTS_START .._Scheduler PURE_IMPORTS_END */
var AsyncScheduler___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var AsyncScheduler = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    AsyncScheduler___extends(AsyncScheduler, _super);
    function AsyncScheduler() {
        _super.apply(this, arguments);
        this.actions = [];
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         */
        this.active = false;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         */
        this.scheduled = undefined;
    }
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift()); // exhaust the scheduler queue
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler);
//# sourceMappingURL=AsyncScheduler.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/QueueScheduler.js
/** PURE_IMPORTS_START ._AsyncScheduler PURE_IMPORTS_END */
var QueueScheduler___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var QueueScheduler = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    QueueScheduler___extends(QueueScheduler, _super);
    function QueueScheduler() {
        _super.apply(this, arguments);
    }
    return QueueScheduler;
}(AsyncScheduler);
//# sourceMappingURL=QueueScheduler.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/queue.js
/** PURE_IMPORTS_START ._QueueAction,._QueueScheduler PURE_IMPORTS_END */


/**
 *
 * Queue Scheduler
 *
 * <span class="informal">Put every next task on a queue, instead of executing it immediately</span>
 *
 * `queue` scheduler, when used with delay, behaves the same as {@link async} scheduler.
 *
 * When used without delay, it schedules given task synchronously - executes it right when
 * it is scheduled. However when called recursively, that is when inside the scheduled task,
 * another task is scheduled with queue scheduler, instead of executing immediately as well,
 * that task will be put on a queue and wait for current one to finish.
 *
 * This means that when you execute task with `queue` scheduler, you are sure it will end
 * before any other task scheduled with that scheduler will start.
 *
 * @examples <caption>Schedule recursively first, then do something</caption>
 *
 * Rx.Scheduler.queue.schedule(() => {
 *   Rx.Scheduler.queue.schedule(() => console.log('second')); // will not happen now, but will be put on a queue
 *
 *   console.log('first');
 * });
 *
 * // Logs:
 * // "first"
 * // "second"
 *
 *
 * @example <caption>Reschedule itself recursively</caption>
 *
 * Rx.Scheduler.queue.schedule(function(state) {
 *   if (state !== 0) {
 *     console.log('before', state);
 *     this.schedule(state - 1); // `this` references currently executing Action,
 *                               // which we reschedule with new state
 *     console.log('after', state);
 *   }
 * }, 0, 3);
 *
 * // In scheduler that runs recursively, you would expect:
 * // "before", 3
 * // "before", 2
 * // "before", 1
 * // "after", 1
 * // "after", 2
 * // "after", 3
 *
 * // But with queue it logs:
 * // "before", 3
 * // "after", 3
 * // "before", 2
 * // "after", 2
 * // "before", 1
 * // "after", 1
 *
 *
 * @static true
 * @name queue
 * @owner Scheduler
 */
var queue = /*@__PURE__*/new QueueScheduler(QueueAction);
//# sourceMappingURL=queue.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/Notification.js
/** PURE_IMPORTS_START ._Observable PURE_IMPORTS_END */

/**
 * Represents a push-based event or value that an {@link Observable} can emit.
 * This class is particularly useful for operators that manage notifications,
 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
 * others. Besides wrapping the actual delivered value, it also annotates it
 * with metadata of, for instance, what type of push message it is (`next`,
 * `error`, or `complete`).
 *
 * @see {@link materialize}
 * @see {@link dematerialize}
 * @see {@link observeOn}
 *
 * @class Notification<T>
 */
var Notification_Notification = /*@__PURE__*/ /*@__PURE__*/function () {
    function Notification(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    /**
     * Delivers to the given `observer` the value wrapped by this Notification.
     * @param {Observer} observer
     * @return
     */
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    /**
     * Given some {@link Observer} callbacks, deliver the value represented by the
     * current Notification to the correctly corresponding callback.
     * @param {function(value: T): void} next An Observer `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    Notification.prototype.do = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    };
    /**
     * Takes an Observer or its individual callback functions, and calls `observe`
     * or `do` methods accordingly.
     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
     * the `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        } else {
            return this.do(nextOrObserver, error, complete);
        }
    };
    /**
     * Returns a simple Observable that just delivers the notification represented
     * by this Notification instance.
     * @return {any}
     */
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return Observable_Observable.of(this.value);
            case 'E':
                return Observable_Observable.throw(this.error);
            case 'C':
                return Observable_Observable.empty();
        }
        throw new Error('unexpected notification kind value');
    };
    /**
     * A shortcut to create a Notification instance of the type `next` from a
     * given value.
     * @param {T} value The `next` value.
     * @return {Notification<T>} The "next" Notification representing the
     * argument.
     */
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return Notification.undefinedValueNotification;
    };
    /**
     * A shortcut to create a Notification instance of the type `error` from a
     * given error.
     * @param {any} [err] The `error` error.
     * @return {Notification<T>} The "error" Notification representing the
     * argument.
     */
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    /**
     * A shortcut to create a Notification instance of the type `complete`.
     * @return {Notification<any>} The valueless "complete" Notification.
     */
    Notification.createComplete = function () {
        return Notification.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}();
//# sourceMappingURL=Notification.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/observeOn.js
/** PURE_IMPORTS_START .._Subscriber,.._Notification PURE_IMPORTS_END */
var observeOn___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 *
 * Re-emits all notifications from source Observable with specified scheduler.
 *
 * <span class="informal">Ensure a specific scheduler is used, from outside of an Observable.</span>
 *
 * `observeOn` is an operator that accepts a scheduler as a first parameter, which will be used to reschedule
 * notifications emitted by the source Observable. It might be useful, if you do not have control over
 * internal scheduler of a given Observable, but want to control when its values are emitted nevertheless.
 *
 * Returned Observable emits the same notifications (nexted values, complete and error events) as the source Observable,
 * but rescheduled with provided scheduler. Note that this doesn't mean that source Observables internal
 * scheduler will be replaced in any way. Original scheduler still will be used, but when the source Observable emits
 * notification, it will be immediately scheduled again - this time with scheduler passed to `observeOn`.
 * An anti-pattern would be calling `observeOn` on Observable that emits lots of values synchronously, to split
 * that emissions into asynchronous chunks. For this to happen, scheduler would have to be passed into the source
 * Observable directly (usually into the operator that creates it). `observeOn` simply delays notifications a
 * little bit more, to ensure that they are emitted at expected moments.
 *
 * As a matter of fact, `observeOn` accepts second parameter, which specifies in milliseconds with what delay notifications
 * will be emitted. The main difference between {@link delay} operator and `observeOn` is that `observeOn`
 * will delay all notifications - including error notifications - while `delay` will pass through error
 * from source Observable immediately when it is emitted. In general it is highly recommended to use `delay` operator
 * for any kind of delaying of values in the stream, while using `observeOn` to specify which scheduler should be used
 * for notification emissions in general.
 *
 * @example <caption>Ensure values in subscribe are called just before browser repaint.</caption>
 * const intervals = Rx.Observable.interval(10); // Intervals are scheduled
 *                                               // with async scheduler by default...
 *
 * intervals
 * .observeOn(Rx.Scheduler.animationFrame)       // ...but we will observe on animationFrame
 * .subscribe(val => {                           // scheduler to ensure smooth animation.
 *   someDiv.style.height = val + 'px';
 * });
 *
 * @see {@link delay}
 *
 * @param {IScheduler} scheduler Scheduler that will be used to reschedule notifications from source Observable.
 * @param {number} [delay] Number of milliseconds that states with what delay every notification should be rescheduled.
 * @return {Observable<T>} Observable that emits the same notifications as the source Observable,
 * but with provided scheduler.
 *
 * @method observeOn
 * @owner Observable
 */
function observeOn(scheduler, delay) {
    if (delay === void 0) {
        delay = 0;
    }
    return function observeOnOperatorFunction(source) {
        return source.lift(new ObserveOnOperator(scheduler, delay));
    };
}
var ObserveOnOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function ObserveOnOperator(scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new observeOn_ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    };
    return ObserveOnOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var observeOn_ObserveOnSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    observeOn___extends(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        _super.call(this, destination);
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnSubscriber.dispatch = function (arg) {
        var notification = arg.notification,
            destination = arg.destination;
        notification.observe(destination);
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
        this.scheduleMessage(Notification_Notification.createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
        this.scheduleMessage(Notification_Notification.createError(err));
    };
    ObserveOnSubscriber.prototype._complete = function () {
        this.scheduleMessage(Notification_Notification.createComplete());
    };
    return ObserveOnSubscriber;
}(Subscriber_Subscriber);
var ObserveOnMessage = /*@__PURE__*/ /*@__PURE__*/function () {
    function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
    return ObserveOnMessage;
}();
//# sourceMappingURL=observeOn.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/ReplaySubject.js
/** PURE_IMPORTS_START ._Subject,._scheduler_queue,._Subscription,._operators_observeOn,._util_ObjectUnsubscribedError,._SubjectSubscription PURE_IMPORTS_END */
var ReplaySubject___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/**
 * @class ReplaySubject<T>
 */
var ReplaySubject_ReplaySubject = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ReplaySubject___extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
        }
        if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
        }
        _super.call(this);
        this.scheduler = scheduler;
        this._events = [];
        this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        this._windowTime = windowTime < 1 ? 1 : windowTime;
    }
    ReplaySubject.prototype.next = function (value) {
        var now = this._getNow();
        this._events.push(new ReplayEvent(now, value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    /** @deprecated internal use only */ReplaySubject.prototype._subscribe = function (subscriber) {
        var _events = this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var subscription;
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        } else if (this.hasError) {
            subscription = Subscription_Subscription.EMPTY;
        } else if (this.isStopped) {
            subscription = Subscription_Subscription.EMPTY;
        } else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new observeOn_ObserveOnSubscriber(subscriber, scheduler));
        }
        var len = _events.length;
        for (var i = 0; i < len && !subscriber.closed; i++) {
            subscriber.next(_events[i].value);
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        } else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        // Trim events that fall out of the time window.
        // Start at the front of the list. Break early once
        // we encounter an event that falls within the window.
        while (spliceCount < eventsCount) {
            if (now - _events[spliceCount].time < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(Subject_Subject);
var ReplayEvent = /*@__PURE__*/ /*@__PURE__*/function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}();
//# sourceMappingURL=ReplaySubject.js.map
// CONCATENATED MODULE: ./node_modules/hy-component/src/rxjs.js
var rxjs__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var rxjs__get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function rxjs__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function rxjs__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function rxjs__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// # src / rxjs.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT




var rxjs_rxjsMixin = function rxjsMixin(C) {
  return function (_C) {
    rxjs__inherits(_class, _C);

    function _class() {
      rxjs__classCallCheck(this, _class);

      return rxjs__possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    rxjs__createClass(_class, [{
      key: "setupComponent",
      value: function setupComponent(el, opts) {
        var _this2 = this;

        var sideEffects = {};

        this.subjects = {};
        this.subjects.disconnect = new Subject_Subject();
        this.subjects.document = new ReplaySubject_ReplaySubject();

        Object.keys(this.constructor.types).map(function (key) {
          _this2.subjects[key] = new ReplaySubject_ReplaySubject(1);
          sideEffects[key] = function (x) {
            return _this2.subjects[key].next(x);
          };
        });

        Object.defineProperty(this.constructor, "sideEffects", {
          get: function get() {
            return sideEffects;
          },
          set: function set() {},
          enumerable: true,
          configurable: true
        });

        rxjs__get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "setupComponent", this).call(this, el, opts);
      }
    }, {
      key: "connectComponent",
      value: function connectComponent() {
        var _this3 = this;

        rxjs__get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "connectComponent", this).call(this);
        this.subjects.document.next(document);
        Object.keys(this.constructor.types).map(function (key) {
          return _this3.subjects[key].next(_this3[key]);
        });
      }
    }, {
      key: "disconnectComponent",
      value: function disconnectComponent() {
        rxjs__get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "disconnectComponent", this).call(this);
        this.subjects.disconnect.next({});
      }
    }, {
      key: "adaptComponent",
      value: function adaptComponent() {
        rxjs__get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "adaptComponent", this).call(this);
        this.subjects.document.next(document);
      }
    }]);

    return _class;
  }(C);
};
// CONCATENATED MODULE: ./node_modules/attr-types/array.js
var array_array = function array(attr) {
  if (attr == null) return null;

  var str = attr.trim().replace(/^\[?(.*?)\]?$/, '$1').split(',').map(function (x) {
    return x.trim();
  });

  return str || null;
};

array_array.stringify = function (a) {
  return a && a.length > 0 ? a.join(',') : null;
};

/* harmony default export */ var attr_types_array = (array_array);
// CONCATENATED MODULE: ./node_modules/attr-types/array-of.js


var array_of_arrayOf = function arrayOf(type) {
  var f = function f(attr) {
    if (attr == null) return null;
    var a = array_array(attr).map(type);
    if (a.reduce(function (r, x) {
      return r && x !== null;
    }, true)) {
      return a;
    }
    return null;
  };

  f.stringify = function (a) {
    var a2 = a && a.map && a.map(type.stringify);
    if (a2 && a2.reduce(function (r, x) {
      return r && x !== null;
    }, true)) {
      return array_array.stringify(a2);
    }
    return null;
  };

  return f;
};

/* harmony default export */ var array_of = (array_of_arrayOf);
// CONCATENATED MODULE: ./node_modules/attr-types/bool.js
var bool = function bool(attr) {
  if (attr == null) return false;
  var attr2 = attr.trim && attr.trim() || attr;
  return !(attr2 === 'false' || attr2 === 'null' || attr2 === 'undefined' || attr2 === '0' || attr2 === false);
};

bool.stringify = function (b) {
  return b ? '' : null;
};

/* harmony default export */ var attr_types_bool = (bool);
// CONCATENATED MODULE: ./node_modules/attr-types/number.js
var number = function number(attr) {
  if (attr == null) return null;
  return Number(attr);
};

number.stringify = function (n) {
  if (n == null) return null;
  return "" + n;
};

/* harmony default export */ var attr_types_number = (number);
// CONCATENATED MODULE: ./node_modules/attr-types/one-of.js
var oneOf = function oneOf(alts) {
  var f = function f(attr) {
    if (attr == null) return null;

    var i = alts.indexOf(attr);
    if (true && i === -1) {
      console.warn('\'' + attr + '\' is not \'oneOf\': ' + alts.join(', '));
    }

    return i > -1 ? alts[i] : null;
  };

  f.stringify = function (o) {
    return alts.indexOf(o) !== -1 ? o : null;
  };

  return f;
};

/* harmony default export */ var one_of = (oneOf);
// CONCATENATED MODULE: ./node_modules/attr-types/regex.js
var regex = function regex(attr) {
  if (attr == null) return null;
  var attr2 = attr.trim && attr.trim() || attr;
  var match = attr2.match(/^\/?(.*?)(\/([gimy]*))?$/);
  return new RegExp(match[1], match[3]);
};

regex.stringify = function (r) {
  return r && r.toString() || null;
};

/* harmony default export */ var attr_types_regex = (regex);
// CONCATENATED MODULE: ./node_modules/attr-types/string.js
var string = function string(attr) {
  return attr;
};

string.stringify = function (s) {
  return s;
};

/* harmony default export */ var attr_types_string = (string);
// CONCATENATED MODULE: ./node_modules/attr-types/index.js










/* harmony default export */ var attr_types = ({
  array: array_array, arrayOf: array_of_arrayOf, bool: bool, number: number, oneOf: oneOf, regex: regex, string: string
});
// CONCATENATED MODULE: ./node_modules/hy-component/src/types.js



/* harmony default export */ var src_types = ({
  array: array_array,
  arrayOf: array_of_arrayOf,
  bool: bool,
  number: number,
  oneOf: oneOf,
  regex: regex,
  string: string
});
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/isScheduler.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
//# sourceMappingURL=isScheduler.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/ScalarObservable.js
/** PURE_IMPORTS_START .._Observable PURE_IMPORTS_END */
var ScalarObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ScalarObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ScalarObservable___extends(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
        _super.call(this);
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
        if (scheduler) {
            this._isScalar = false;
        }
    }
    ScalarObservable.create = function (value, scheduler) {
        return new ScalarObservable(value, scheduler);
    };
    ScalarObservable.dispatch = function (state) {
        var done = state.done,
            value = state.value,
            subscriber = state.subscriber;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    };
    /** @deprecated internal use only */ScalarObservable.prototype._subscribe = function (subscriber) {
        var value = this.value;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value: value, subscriber: subscriber
            });
        } else {
            subscriber.next(value);
            if (!subscriber.closed) {
                subscriber.complete();
            }
        }
    };
    return ScalarObservable;
}(Observable_Observable);
//# sourceMappingURL=ScalarObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/EmptyObservable.js
/** PURE_IMPORTS_START .._Observable PURE_IMPORTS_END */
var EmptyObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var EmptyObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    EmptyObservable___extends(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits a complete notification.
     *
     * <span class="informal">Just emits 'complete', and nothing else.
     * </span>
     *
     * <img src="./img/empty.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the complete notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then complete.</caption>
     * var result = Rx.Observable.empty().startWith(7);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
     * );
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following to the console:
     * // x is equal to the count on the interval eg(0,1,2,3,...)
     * // x will occur every 1000ms
     * // if x % 2 is equal to 1 print abc
     * // if x % 2 is not equal to 1 nothing will be output
     *
     * @see {@link create}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emission of the complete notification.
     * @return {Observable} An "empty" Observable: emits only the complete
     * notification.
     * @static true
     * @name empty
     * @owner Observable
     */
    EmptyObservable.create = function (scheduler) {
        return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (arg) {
        var subscriber = arg.subscriber;
        subscriber.complete();
    };
    /** @deprecated internal use only */EmptyObservable.prototype._subscribe = function (subscriber) {
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
        } else {
            subscriber.complete();
        }
    };
    return EmptyObservable;
}(Observable_Observable);
//# sourceMappingURL=EmptyObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/ArrayObservable.js
/** PURE_IMPORTS_START .._Observable,._ScalarObservable,._EmptyObservable,.._util_isScheduler PURE_IMPORTS_END */
var ArrayObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ArrayObservable_ArrayObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ArrayObservable___extends(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
        _super.call(this);
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    ArrayObservable.create = function (array, scheduler) {
        return new ArrayObservable(array, scheduler);
    };
    /**
     * Creates an Observable that emits some values you specify as arguments,
     * immediately one after the other, and then emits a complete notification.
     *
     * <span class="informal">Emits the arguments you provide, then completes.
     * </span>
     *
     * <img src="./img/of.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the arguments given, and the complete notification thereafter. It can
     * be used for composing with other Observables, such as with {@link concat}.
     * By default, it uses a `null` IScheduler, which means the `next`
     * notifications are sent synchronously, although with a different IScheduler
     * it is possible to determine when those notifications will be delivered.
     *
     * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
     * var numbers = Rx.Observable.of(10, 20, 30);
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var interval = Rx.Observable.interval(1000);
     * var result = numbers.concat(letters).concat(interval);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link throw}
     *
     * @param {...T} values Arguments that represent `next` values to be emitted.
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emissions of the `next` notifications.
     * @return {Observable<T>} An Observable that emits each given input value.
     * @static true
     * @name of
     * @owner Observable
     */
    ArrayObservable.of = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler(scheduler)) {
            array.pop();
        } else {
            scheduler = null;
        }
        var len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        } else if (len === 1) {
            return new ScalarObservable(array[0], scheduler);
        } else {
            return new EmptyObservable(scheduler);
        }
    };
    ArrayObservable.dispatch = function (state) {
        var array = state.array,
            index = state.index,
            count = state.count,
            subscriber = state.subscriber;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    };
    /** @deprecated internal use only */ArrayObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var array = this.array;
        var count = array.length;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array, index: index, count: count, subscriber: subscriber
            });
        } else {
            for (var i = 0; i < count && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayObservable;
}(Observable_Observable);
//# sourceMappingURL=ArrayObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/OuterSubscriber.js
/** PURE_IMPORTS_START ._Subscriber PURE_IMPORTS_END */
var OuterSubscriber___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var OuterSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    OuterSubscriber___extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=OuterSubscriber.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/isArrayLike.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArrayLike = function isArrayLike(x) {
  return x && typeof x.length === 'number';
};
//# sourceMappingURL=isArrayLike.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/isPromise.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
//# sourceMappingURL=isPromise.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/symbol/iterator.js
/** PURE_IMPORTS_START .._util_root PURE_IMPORTS_END */

function symbolIteratorPonyfill(root) {
    var _Symbol = root.Symbol;
    if (typeof _Symbol === 'function') {
        if (!_Symbol.iterator) {
            _Symbol.iterator = _Symbol('iterator polyfill');
        }
        return _Symbol.iterator;
    } else {
        // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
        var Set_1 = root.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root.Map;
        // required for compatability with es6-shim
        if (Map_1) {
            var keys = Object.getOwnPropertyNames(Map_1.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
                if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                    return key;
                }
            }
        }
        return '@@iterator';
    }
}
var iterator_iterator = /*@__PURE__*/symbolIteratorPonyfill(root["a" /* root */]);
/**
 * @deprecated use iterator instead
 */
var $$iterator = iterator_iterator;
//# sourceMappingURL=iterator.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/InnerSubscriber.js
/** PURE_IMPORTS_START ._Subscriber PURE_IMPORTS_END */
var InnerSubscriber___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    InnerSubscriber___extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=InnerSubscriber.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/subscribeToResult.js
/** PURE_IMPORTS_START ._root,._isArrayLike,._isPromise,._isObject,.._Observable,.._symbol_iterator,.._InnerSubscriber,.._symbol_observable PURE_IMPORTS_END */








function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        } else {
            destination.syncErrorThrowable = true;
            return result.subscribe(destination);
        }
    } else if (isArrayLike(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    } else if (isPromise(result)) {
        result.then(function (value) {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) {
            return destination.error(err);
        }).then(null, function (err) {
            // Escaping the Promise trap: globally throw unhandled errors
            root["a" /* root */].setTimeout(function () {
                throw err;
            });
        });
        return destination;
    } else if (result && typeof result[iterator_iterator] === 'function') {
        var iterator = result[iterator_iterator]();
        do {
            var item = iterator.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    } else if (result && typeof result[observable_observable] === 'function') {
        var obs = result[observable_observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
        } else {
            return obs.subscribe(new InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    } else {
        var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = "You provided " + value + " where a stream was expected." + ' You can provide an Observable, Promise, Array, or Iterable.';
        destination.error(new TypeError(msg));
    }
    return null;
}
//# sourceMappingURL=subscribeToResult.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/combineLatest.js
/** PURE_IMPORTS_START .._observable_ArrayObservable,.._util_isArray,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var combineLatest___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




var none = {};
/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from this Observable with values from
 * Observables passed as arguments. This is done by subscribing to each
 * Observable, in order, and collecting an array of each of the most recent
 * values any time any of the input Observables emits, then either taking that
 * array and passing it as arguments to an optional `project` function and
 * emitting the return value of that, or just emitting the array of recent
 * values directly if there is no `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = weight.combineLatest(height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * // With output to console:
 * // BMI is 24.212293388429753
 * // BMI is 23.93948099205209
 * // BMI is 23.671253629592222
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {ObservableInput} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method combineLatest
 * @owner Observable
 */
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray(observables[0])) {
        observables = observables[0].slice();
    }
    return function (source) {
        return source.lift.call(new ArrayObservable_ArrayObservable([source].concat(observables)), new CombineLatestOperator(project));
    };
}
var CombineLatestOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function CombineLatestOperator(project) {
        this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new combineLatest_CombineLatestSubscriber(subscriber, this.project));
    };
    return CombineLatestOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var combineLatest_CombineLatestSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    combineLatest___extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
        _super.call(this, destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(none);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        } else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond ? 0 : oldVal === none ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.project) {
                this._tryProject(values);
            } else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
        var result;
        try {
            result = this.project.apply(this, values);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=combineLatest.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/combineLatest.js
/** PURE_IMPORTS_START .._util_isScheduler,.._util_isArray,._ArrayObservable,.._operators_combineLatest PURE_IMPORTS_END */




/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from all the Observables passed as
 * arguments. This is done by subscribing to each Observable in order and,
 * whenever any Observable emits, collecting an array of the most recent
 * values from each Observable. So if you pass `n` Observables to operator,
 * returned Observable will always emit an array of `n` values, in order
 * corresponding to order of passed Observables (value from the first Observable
 * on the first place and so on).
 *
 * Static version of `combineLatest` accepts either an array of Observables
 * or each Observable can be put directly as an argument. Note that array of
 * Observables is good choice, if you don't know beforehand how many Observables
 * you will combine. Passing empty array will result in Observable that
 * completes immediately.
 *
 * To ensure output array has always the same length, `combineLatest` will
 * actually wait for all input Observables to emit at least once,
 * before it starts emitting results. This means if some Observable emits
 * values before other Observables started emitting, all that values but last
 * will be lost. On the other hand, is some Observable does not emit value but
 * completes, resulting Observable will complete at the same moment without
 * emitting anything, since it will be now impossible to include value from
 * completed Observable in resulting array. Also, if some input Observable does
 * not emit any value and never completes, `combineLatest` will also never emit
 * and never complete, since, again, it will wait for all streams to emit some
 * value.
 *
 * If at least one Observable was passed to `combineLatest` and all passed Observables
 * emitted something, resulting Observable will complete when all combined
 * streams complete. So even if some Observable completes, result of
 * `combineLatest` will still emit values when other Observables do. In case
 * of completed Observable, its value from now on will always be the last
 * emitted value. On the other hand, if any Observable errors, `combineLatest`
 * will error immediately as well, and all other Observables will be unsubscribed.
 *
 * `combineLatest` accepts as optional parameter `project` function, which takes
 * as arguments all values that would normally be emitted by resulting Observable.
 * `project` can return any kind of value, which will be then emitted by Observable
 * instead of default array. Note that `project` does not take as argument that array
 * of values, but values themselves. That means default `project` can be imagined
 * as function that takes all its arguments and puts them into an array.
 *
 *
 * @example <caption>Combine two timer Observables</caption>
 * const firstTimer = Rx.Observable.timer(0, 1000); // emit 0, 1, 2... after every second, starting from now
 * const secondTimer = Rx.Observable.timer(500, 1000); // emit 0, 1, 2... after every second, starting 0,5s from now
 * const combinedTimers = Rx.Observable.combineLatest(firstTimer, secondTimer);
 * combinedTimers.subscribe(value => console.log(value));
 * // Logs
 * // [0, 0] after 0.5s
 * // [1, 0] after 1s
 * // [1, 1] after 1.5s
 * // [2, 1] after 2s
 *
 *
 * @example <caption>Combine an array of Observables</caption>
 * const observables = [1, 5, 10].map(
 *   n => Rx.Observable.of(n).delay(n * 1000).startWith(0) // emit 0 and then emit n after n seconds
 * );
 * const combined = Rx.Observable.combineLatest(observables);
 * combined.subscribe(value => console.log(value));
 * // Logs
 * // [0, 0, 0] immediately
 * // [1, 0, 0] after 1s
 * // [1, 5, 0] after 5s
 * // [1, 5, 10] after 10s
 *
 *
 * @example <caption>Use project function to dynamically calculate the Body-Mass Index</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = Rx.Observable.combineLatest(weight, height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * // With output to console:
 * // BMI is 24.212293388429753
 * // BMI is 23.93948099205209
 * // BMI is 23.671253629592222
 *
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {ObservableInput} observable1 An input Observable to combine with other Observables.
 * @param {ObservableInput} observable2 An input Observable to combine with other Observables.
 * More than one input Observables may be given as arguments
 * or an array of Observables may be given as the first argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @param {Scheduler} [scheduler=null] The IScheduler to use for subscribing to
 * each input Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @static true
 * @name combineLatest
 * @owner Observable
 */
function combineLatest_combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    var scheduler = null;
    if (isScheduler(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray(observables[0])) {
        observables = observables[0];
    }
    return new ArrayObservable_ArrayObservable(observables, scheduler).lift(new CombineLatestOperator(project));
}
//# sourceMappingURL=combineLatest.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/DeferObservable.js
/** PURE_IMPORTS_START .._Observable,.._util_subscribeToResult,.._OuterSubscriber PURE_IMPORTS_END */
var DeferObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var DeferObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    DeferObservable___extends(DeferObservable, _super);
    function DeferObservable(observableFactory) {
        _super.call(this);
        this.observableFactory = observableFactory;
    }
    /**
     * Creates an Observable that, on subscribe, calls an Observable factory to
     * make an Observable for each new Observer.
     *
     * <span class="informal">Creates the Observable lazily, that is, only when it
     * is subscribed.
     * </span>
     *
     * <img src="./img/defer.png" width="100%">
     *
     * `defer` allows you to create the Observable only when the Observer
     * subscribes, and create a fresh Observable for each Observer. It waits until
     * an Observer subscribes to it, and then it generates an Observable,
     * typically with an Observable factory function. It does this afresh for each
     * subscriber, so although each subscriber may think it is subscribing to the
     * same Observable, in fact each subscriber gets its own individual
     * Observable.
     *
     * @example <caption>Subscribe to either an Observable of clicks or an Observable of interval, at random</caption>
     * var clicksOrInterval = Rx.Observable.defer(function () {
     *   if (Math.random() > 0.5) {
     *     return Rx.Observable.fromEvent(document, 'click');
     *   } else {
     *     return Rx.Observable.interval(1000);
     *   }
     * });
     * clicksOrInterval.subscribe(x => console.log(x));
     *
     * // Results in the following behavior:
     * // If the result of Math.random() is greater than 0.5 it will listen
     * // for clicks anywhere on the "document"; when document is clicked it
     * // will log a MouseEvent object to the console. If the result is less
     * // than 0.5 it will emit ascending numbers, one every second(1000ms).
     *
     * @see {@link create}
     *
     * @param {function(): SubscribableOrPromise} observableFactory The Observable
     * factory function to invoke for each Observer that subscribes to the output
     * Observable. May also return a Promise, which will be converted on the fly
     * to an Observable.
     * @return {Observable} An Observable whose Observers' subscriptions trigger
     * an invocation of the given Observable factory function.
     * @static true
     * @name defer
     * @owner Observable
     */
    DeferObservable.create = function (observableFactory) {
        return new DeferObservable(observableFactory);
    };
    /** @deprecated internal use only */DeferObservable.prototype._subscribe = function (subscriber) {
        return new DeferObservable_DeferSubscriber(subscriber, this.observableFactory);
    };
    return DeferObservable;
}(Observable_Observable);
var DeferObservable_DeferSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    DeferObservable___extends(DeferSubscriber, _super);
    function DeferSubscriber(destination, factory) {
        _super.call(this, destination);
        this.factory = factory;
        this.tryDefer();
    }
    DeferSubscriber.prototype.tryDefer = function () {
        try {
            this._callFactory();
        } catch (err) {
            this._error(err);
        }
    };
    DeferSubscriber.prototype._callFactory = function () {
        var result = this.factory();
        if (result) {
            this.add(subscribeToResult(this, result));
        }
    };
    return DeferSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=DeferObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/defer.js
/** PURE_IMPORTS_START ._DeferObservable PURE_IMPORTS_END */

var defer = DeferObservable.create;
//# sourceMappingURL=defer.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/FromEventObservable.js
/** PURE_IMPORTS_START .._Observable,.._util_tryCatch,.._util_isFunction,.._util_errorObject,.._Subscription PURE_IMPORTS_END */
var FromEventObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





var FromEventObservable_toString = Object.prototype.toString;
function isNodeStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
}
function isJQueryStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
}
function isNodeList(sourceObj) {
    return !!sourceObj && FromEventObservable_toString.call(sourceObj) === '[object NodeList]';
}
function isHTMLCollection(sourceObj) {
    return !!sourceObj && FromEventObservable_toString.call(sourceObj) === '[object HTMLCollection]';
}
function isEventTarget(sourceObj) {
    return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var FromEventObservable_FromEventObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    FromEventObservable___extends(FromEventObservable, _super);
    function FromEventObservable(sourceObj, eventName, selector, options) {
        _super.call(this);
        this.sourceObj = sourceObj;
        this.eventName = eventName;
        this.selector = selector;
        this.options = options;
    }
    /* tslint:enable:max-line-length */
    /**
     * Creates an Observable that emits events of a specific type coming from the
     * given event target.
     *
     * <span class="informal">Creates an Observable from DOM events, or Node.js
     * EventEmitter events or others.</span>
     *
     * <img src="./img/fromEvent.png" width="100%">
     *
     * `fromEvent` accepts as a first argument event target, which is an object with methods
     * for registering event handler functions. As a second argument it takes string that indicates
     * type of event we want to listen for. `fromEvent` supports selected types of event targets,
     * which are described in detail below. If your event target does not match any of the ones listed,
     * you should use {@link fromEventPattern}, which can be used on arbitrary APIs.
     * When it comes to APIs supported by `fromEvent`, their methods for adding and removing event
     * handler functions have different names, but they all accept a string describing event type
     * and function itself, which will be called whenever said event happens.
     *
     * Every time resulting Observable is subscribed, event handler function will be registered
     * to event target on given event type. When that event fires, value
     * passed as a first argument to registered function will be emitted by output Observable.
     * When Observable is unsubscribed, function will be unregistered from event target.
     *
     * Note that if event target calls registered function with more than one argument, second
     * and following arguments will not appear in resulting stream. In order to get access to them,
     * you can pass to `fromEvent` optional project function, which will be called with all arguments
     * passed to event handler. Output Observable will then emit value returned by project function,
     * instead of the usual value.
     *
     * Remember that event targets listed below are checked via duck typing. It means that
     * no matter what kind of object you have and no matter what environment you work in,
     * you can safely use `fromEvent` on that object if it exposes described methods (provided
     * of course they behave as was described above). So for example if Node.js library exposes
     * event target which has the same method names as DOM EventTarget, `fromEvent` is still
     * a good choice.
     *
     * If the API you use is more callback then event handler oriented (subscribed
     * callback function fires only once and thus there is no need to manually
     * unregister it), you should use {@link bindCallback} or {@link bindNodeCallback}
     * instead.
     *
     * `fromEvent` supports following types of event targets:
     *
     * **DOM EventTarget**
     *
     * This is an object with `addEventListener` and `removeEventListener` methods.
     *
     * In the browser, `addEventListener` accepts - apart from event type string and event
     * handler function arguments - optional third parameter, which is either an object or boolean,
     * both used for additional configuration how and when passed function will be called. When
     * `fromEvent` is used with event target of that type, you can provide this values
     * as third parameter as well.
     *
     * **Node.js EventEmitter**
     *
     * An object with `addListener` and `removeListener` methods.
     *
     * **JQuery-style event target**
     *
     * An object with `on` and `off` methods
     *
     * **DOM NodeList**
     *
     * List of DOM Nodes, returned for example by `document.querySelectorAll` or `Node.childNodes`.
     *
     * Although this collection is not event target in itself, `fromEvent` will iterate over all Nodes
     * it contains and install event handler function in every of them. When returned Observable
     * is unsubscribed, function will be removed from all Nodes.
     *
     * **DOM HtmlCollection**
     *
     * Just as in case of NodeList it is a collection of DOM nodes. Here as well event handler function is
     * installed and removed in each of elements.
     *
     *
     * @example <caption>Emits clicks happening on the DOM document</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * clicks.subscribe(x => console.log(x));
     *
     * // Results in:
     * // MouseEvent object logged to console every time a click
     * // occurs on the document.
     *
     *
     * @example <caption>Use addEventListener with capture option</caption>
     * var clicksInDocument = Rx.Observable.fromEvent(document, 'click', true); // note optional configuration parameter
     *                                                                          // which will be passed to addEventListener
     * var clicksInDiv = Rx.Observable.fromEvent(someDivInDocument, 'click');
     *
     * clicksInDocument.subscribe(() => console.log('document'));
     * clicksInDiv.subscribe(() => console.log('div'));
     *
     * // By default events bubble UP in DOM tree, so normally
     * // when we would click on div in document
     * // "div" would be logged first and then "document".
     * // Since we specified optional `capture` option, document
     * // will catch event when it goes DOWN DOM tree, so console
     * // will log "document" and then "div".
     *
     * @see {@link bindCallback}
     * @see {@link bindNodeCallback}
     * @see {@link fromEventPattern}
     *
     * @param {EventTargetLike} target The DOM EventTarget, Node.js
     * EventEmitter, JQuery-like event target, NodeList or HTMLCollection to attach the event handler to.
     * @param {string} eventName The event name of interest, being emitted by the
     * `target`.
     * @param {EventListenerOptions} [options] Options to pass through to addEventListener
     * @param {SelectorMethodSignature<T>} [selector] An optional function to
     * post-process results. It takes the arguments from the event handler and
     * should return a single value.
     * @return {Observable<T>}
     * @static true
     * @name fromEvent
     * @owner Observable
     */
    FromEventObservable.create = function (target, eventName, options, selector) {
        if (isFunction(options)) {
            selector = options;
            options = undefined;
        }
        return new FromEventObservable(target, eventName, selector, options);
    };
    FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber, options) {
        var unsubscribe;
        if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
            for (var i = 0, len = sourceObj.length; i < len; i++) {
                FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
            }
        } else if (isEventTarget(sourceObj)) {
            var source_1 = sourceObj;
            sourceObj.addEventListener(eventName, handler, options);
            unsubscribe = function unsubscribe() {
                return source_1.removeEventListener(eventName, handler, options);
            };
        } else if (isJQueryStyleEventEmitter(sourceObj)) {
            var source_2 = sourceObj;
            sourceObj.on(eventName, handler);
            unsubscribe = function unsubscribe() {
                return source_2.off(eventName, handler);
            };
        } else if (isNodeStyleEventEmitter(sourceObj)) {
            var source_3 = sourceObj;
            sourceObj.addListener(eventName, handler);
            unsubscribe = function unsubscribe() {
                return source_3.removeListener(eventName, handler);
            };
        } else {
            throw new TypeError('Invalid event target');
        }
        subscriber.add(new Subscription_Subscription(unsubscribe));
    };
    /** @deprecated internal use only */FromEventObservable.prototype._subscribe = function (subscriber) {
        var sourceObj = this.sourceObj;
        var eventName = this.eventName;
        var options = this.options;
        var selector = this.selector;
        var handler = selector ? function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var result = tryCatch(selector).apply(void 0, args);
            if (result === errorObject) {
                subscriber.error(errorObject.e);
            } else {
                subscriber.next(result);
            }
        } : function (e) {
            return subscriber.next(e);
        };
        FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options);
    };
    return FromEventObservable;
}(Observable_Observable);
//# sourceMappingURL=FromEventObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/fromEvent.js
/** PURE_IMPORTS_START ._FromEventObservable PURE_IMPORTS_END */

var fromEvent = FromEventObservable_FromEventObservable.create;
//# sourceMappingURL=fromEvent.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/mergeMap.js
/** PURE_IMPORTS_START .._util_subscribeToResult,.._OuterSubscriber PURE_IMPORTS_END */
var mergeMap___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
 * var letters = Rx.Observable.of('a', 'b', 'c');
 * var result = letters.mergeMap(x =>
 *   Rx.Observable.interval(1000).map(i => x+i)
 * );
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // a0
 * // b0
 * // c0
 * // a1
 * // b1
 * // c1
 * // continues to list a,b,c with respective ascending integers
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and merging the results of the Observables obtained
 * from this transformation.
 * @method mergeMap
 * @owner Observable
 */
function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    return function mergeMapOperatorFunction(source) {
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
        }
        return source.lift(new MergeMapOperator(project, resultSelector, concurrent));
    };
}
var MergeMapOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
        return source.subscribe(new mergeMap_MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
    };
    return MergeMapOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var mergeMap_MergeMapSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    mergeMap___extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        } else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        } else {
            this.destination.next(innerValue);
        }
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        } else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=mergeMap.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/identity.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity(x) {
    return x;
}
//# sourceMappingURL=identity.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/mergeAll.js
/** PURE_IMPORTS_START ._mergeMap,.._util_identity PURE_IMPORTS_END */


/**
 * Converts a higher-order Observable into a first-order Observable which
 * concurrently delivers all values that are emitted on the inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables.</span>
 *
 * <img src="./img/mergeAll.png" width="100%">
 *
 * `mergeAll` subscribes to an Observable that emits Observables, also known as
 * a higher-order Observable. Each time it observes one of these emitted inner
 * Observables, it subscribes to that and delivers all the values from the
 * inner Observable on the output Observable. The output Observable only
 * completes once all inner Observables have completed. Any error delivered by
 * a inner Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var firstOrder = higherOrder.mergeAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
 * var firstOrder = higherOrder.mergeAll(2);
 * firstOrder.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link merge}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits values coming from all the
 * inner Observables emitted by the source Observable.
 * @method mergeAll
 * @owner Observable
 */
function mergeAll(concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    return mergeMap(identity, null, concurrent);
}
//# sourceMappingURL=mergeAll.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/merge.js
/** PURE_IMPORTS_START .._Observable,._ArrayObservable,.._util_isScheduler,.._operators_mergeAll PURE_IMPORTS_END */




/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (as arguments), and simply
 * forwards (without doing any transformation) all the values from all the input
 * Observables to the output Observable. The output Observable only completes
 * once all input Observables have completed. Any error delivered by an input
 * Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // timer will emit ascending values, one every second(1000ms) to console
 * // clicks logs MouseEvents to console everytime the "document" is clicked
 * // Since the two streams are merged you see these happening
 * // as they occur.
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // - First timer1 and timer2 will run concurrently
 * // - timer1 will emit a value every 1000ms for 10 iterations
 * // - timer2 will emit a value every 2000ms for 6 iterations
 * // - after timer1 hits it's max iteration, timer2 will
 * //   continue, and timer3 will start to run concurrently with timer2
 * // - when timer2 hits it's max iteration it terminates, and
 * //   timer3 will continue to emit a value every 500ms until it is complete
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {...ObservableInput} observables Input Observables to merge together.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The IScheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @static true
 * @name merge
 * @owner Observable
 */
function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if (isScheduler(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    } else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable_Observable) {
        return observables[0];
    }
    return mergeAll(concurrent)(new ArrayObservable_ArrayObservable(observables, scheduler));
}
//# sourceMappingURL=merge.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/NeverObservable.js
/** PURE_IMPORTS_START .._Observable,.._util_noop PURE_IMPORTS_END */
var NeverObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var NeverObservable_NeverObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    NeverObservable___extends(NeverObservable, _super);
    function NeverObservable() {
        _super.call(this);
    }
    /**
     * Creates an Observable that emits no items to the Observer.
     *
     * <span class="informal">An Observable that never emits anything.</span>
     *
     * <img src="./img/never.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that emits
     * neither values nor errors nor the completion notification. It can be used
     * for testing purposes or for composing with other Observables. Please note
     * that by never emitting a complete notification, this Observable keeps the
     * subscription from being disposed automatically. Subscriptions need to be
     * manually disposed.
     *
     * @example <caption>Emit the number 7, then never emit anything else (not even complete).</caption>
     * function info() {
     *   console.log('Will not be called');
     * }
     * var result = Rx.Observable.never().startWith(7);
     * result.subscribe(x => console.log(x), info, info);
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link of}
     * @see {@link throw}
     *
     * @return {Observable} A "never" Observable: never emits anything.
     * @static true
     * @name never
     * @owner Observable
     */
    NeverObservable.create = function () {
        return new NeverObservable();
    };
    /** @deprecated internal use only */NeverObservable.prototype._subscribe = function (subscriber) {
        noop();
    };
    return NeverObservable;
}(Observable_Observable);
//# sourceMappingURL=NeverObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/never.js
/** PURE_IMPORTS_START ._NeverObservable PURE_IMPORTS_END */

var never = NeverObservable_NeverObservable.create;
//# sourceMappingURL=never.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/AnimationFrame.js
/** PURE_IMPORTS_START ._root PURE_IMPORTS_END */

var RequestAnimationFrameDefinition = /*@__PURE__*/ /*@__PURE__*/function () {
    function RequestAnimationFrameDefinition(root) {
        if (root.requestAnimationFrame) {
            this.cancelAnimationFrame = root.cancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.requestAnimationFrame.bind(root);
        } else if (root.mozRequestAnimationFrame) {
            this.cancelAnimationFrame = root.mozCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.mozRequestAnimationFrame.bind(root);
        } else if (root.webkitRequestAnimationFrame) {
            this.cancelAnimationFrame = root.webkitCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.webkitRequestAnimationFrame.bind(root);
        } else if (root.msRequestAnimationFrame) {
            this.cancelAnimationFrame = root.msCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.msRequestAnimationFrame.bind(root);
        } else if (root.oRequestAnimationFrame) {
            this.cancelAnimationFrame = root.oCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.oRequestAnimationFrame.bind(root);
        } else {
            this.cancelAnimationFrame = root.clearTimeout.bind(root);
            this.requestAnimationFrame = function (cb) {
                return root.setTimeout(cb, 1000 / 60);
            };
        }
    }
    return RequestAnimationFrameDefinition;
}();
var AnimationFrame = /*@__PURE__*/new RequestAnimationFrameDefinition(root["a" /* root */]);
//# sourceMappingURL=AnimationFrame.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/AnimationFrameAction.js
/** PURE_IMPORTS_START ._AsyncAction,.._util_AnimationFrame PURE_IMPORTS_END */
var AnimationFrameAction___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AnimationFrameAction_AnimationFrameAction = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    AnimationFrameAction___extends(AnimationFrameAction, _super);
    function AnimationFrameAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        // If delay is greater than 0, request as an async action.
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        // Push the action to the end of the scheduler queue.
        scheduler.actions.push(this);
        // If an animation frame has already been requested, don't request another
        // one. If an animation frame hasn't been requested yet, request one. Return
        // the current animation frame request id.
        return scheduler.scheduled || (scheduler.scheduled = AnimationFrame.requestAnimationFrame(scheduler.flush.bind(scheduler, null)));
    };
    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        // If the scheduler queue is empty, cancel the requested animation frame and
        // set the scheduled flag to undefined so the next AnimationFrameAction will
        // request its own.
        if (scheduler.actions.length === 0) {
            AnimationFrame.cancelAnimationFrame(id);
            scheduler.scheduled = undefined;
        }
        // Return undefined so the action knows to request a new async id if it's rescheduled.
        return undefined;
    };
    return AnimationFrameAction;
}(AsyncAction_AsyncAction);
//# sourceMappingURL=AnimationFrameAction.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/AnimationFrameScheduler.js
/** PURE_IMPORTS_START ._AsyncScheduler PURE_IMPORTS_END */
var AnimationFrameScheduler___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var AnimationFrameScheduler = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    AnimationFrameScheduler___extends(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
        _super.apply(this, arguments);
    }
    AnimationFrameScheduler.prototype.flush = function (action) {
        this.active = true;
        this.scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AnimationFrameScheduler;
}(AsyncScheduler);
//# sourceMappingURL=AnimationFrameScheduler.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/animationFrame.js
/** PURE_IMPORTS_START ._AnimationFrameAction,._AnimationFrameScheduler PURE_IMPORTS_END */


/**
 *
 * Animation Frame Scheduler
 *
 * <span class="informal">Perform task when `window.requestAnimationFrame` would fire</span>
 *
 * When `animationFrame` scheduler is used with delay, it will fall back to {@link async} scheduler
 * behaviour.
 *
 * Without delay, `animationFrame` scheduler can be used to create smooth browser animations.
 * It makes sure scheduled task will happen just before next browser content repaint,
 * thus performing animations as efficiently as possible.
 *
 * @example <caption>Schedule div height animation</caption>
 * const div = document.querySelector('.some-div');
 *
 * Rx.Scheduler.schedule(function(height) {
 *   div.style.height = height + "px";
 *
 *   this.schedule(height + 1);  // `this` references currently executing Action,
 *                               // which we reschedule with new state
 * }, 0, 0);
 *
 * // You will see .some-div element growing in height
 *
 *
 * @static true
 * @name animationFrame
 * @owner Scheduler
 */
var animationFrame = /*@__PURE__*/new AnimationFrameScheduler(AnimationFrameAction_AnimationFrameAction);
//# sourceMappingURL=animationFrame.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/tap.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var tap___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/* tslint:enable:max-line-length */
/**
 * Perform a side effect for every emission on the source Observable, but return
 * an Observable that is identical to the source.
 *
 * <span class="informal">Intercepts each emission on the source and runs a
 * function, but returns an output which is identical to the source as long as errors don't occur.</span>
 *
 * <img src="./img/do.png" width="100%">
 *
 * Returns a mirrored Observable of the source Observable, but modified so that
 * the provided Observer is called to perform a side effect for every value,
 * error, and completion emitted by the source. Any errors that are thrown in
 * the aforementioned Observer or handlers are safely sent down the error path
 * of the output Observable.
 *
 * This operator is useful for debugging your Observables for the correct values
 * or performing other side effects.
 *
 * Note: this is different to a `subscribe` on the Observable. If the Observable
 * returned by `do` is not subscribed, the side effects specified by the
 * Observer will never happen. `do` therefore simply spies on existing
 * execution, it does not trigger an execution to happen like `subscribe` does.
 *
 * @example <caption>Map every click to the clientX position of that click, while also logging the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks
 *   .do(ev => console.log(ev))
 *   .map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link map}
 * @see {@link subscribe}
 *
 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
 * callback for `next`.
 * @param {function} [error] Callback for errors in the source.
 * @param {function} [complete] Callback for the completion of the source.
 * @return {Observable} An Observable identical to the source, but runs the
 * specified Observer or callback(s) for each item.
 * @name tap
 */
function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
var DoOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new tap_DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var tap_DoSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    tap___extends(DoSubscriber, _super);
    function DoSubscriber(destination, nextOrObserver, error, complete) {
        _super.call(this, destination);
        var safeSubscriber = new Subscriber_Subscriber(nextOrObserver, error, complete);
        safeSubscriber.syncErrorThrowable = true;
        this.add(safeSubscriber);
        this.safeSubscriber = safeSubscriber;
    }
    DoSubscriber.prototype._next = function (value) {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.next(value);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        } else {
            this.destination.next(value);
        }
    };
    DoSubscriber.prototype._error = function (err) {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.error(err);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        } else {
            this.destination.error(err);
        }
    };
    DoSubscriber.prototype._complete = function () {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.complete();
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        } else {
            this.destination.complete();
        }
    };
    return DoSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=tap.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/filter.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var filter___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/* tslint:enable:max-line-length */
/**
 * Filter items emitted by the source Observable by only emitting those that
 * satisfy a specified predicate.
 *
 * <span class="informal">Like
 * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
 * it only emits a value from the source if it passes a criterion function.</span>
 *
 * <img src="./img/filter.png" width="100%">
 *
 * Similar to the well-known `Array.prototype.filter` method, this operator
 * takes values from the source Observable, passes them through a `predicate`
 * function and only emits those values that yielded `true`.
 *
 * @example <caption>Emit only click events whose target was a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV');
 * clicksOnDivs.subscribe(x => console.log(x));
 *
 * @see {@link distinct}
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 * @see {@link ignoreElements}
 * @see {@link partition}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted, if `false` the value is not passed to the output
 * Observable. The `index` parameter is the number `i` for the i-th source
 * emission that has happened since the subscription, starting from the number
 * `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of values from the source that were
 * allowed by the `predicate` function.
 * @method filter
 * @owner Observable
 */
function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return source.lift(new FilterOperator(predicate, thisArg));
    };
}
var FilterOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function FilterOperator(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    };
    return FilterOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FilterSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    filter___extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.count = 0;
    }
    // the try catch block below is left specifically for
    // optimization and perf reasons. a tryCatcher is not necessary here.
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=filter.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/map.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var map___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
var MapOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    map___extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        _super.call(this, destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=map.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/pairwise.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var pairwise___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Groups pairs of consecutive emissions together and emits them as an array of
 * two values.
 *
 * <span class="informal">Puts the current value and previous value together as
 * an array, and emits that.</span>
 *
 * <img src="./img/pairwise.png" width="100%">
 *
 * The Nth emission from the source Observable will cause the output Observable
 * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
 * pair. For this reason, `pairwise` emits on the second and subsequent
 * emissions from the source Observable, but not on the first emission, because
 * there is no previous value in that case.
 *
 * @example <caption>On every click (starting from the second), emit the relative distance to the previous click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var pairs = clicks.pairwise();
 * var distance = pairs.map(pair => {
 *   var x0 = pair[0].clientX;
 *   var y0 = pair[0].clientY;
 *   var x1 = pair[1].clientX;
 *   var y1 = pair[1].clientY;
 *   return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
 * });
 * distance.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 *
 * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
 * consecutive values from the source Observable.
 * @method pairwise
 * @owner Observable
 */
function pairwise() {
    return function (source) {
        return source.lift(new PairwiseOperator());
    };
}
var PairwiseOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function PairwiseOperator() {}
    PairwiseOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new PairwiseSubscriber(subscriber));
    };
    return PairwiseOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var PairwiseSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    pairwise___extends(PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
        _super.call(this, destination);
        this.hasPrev = false;
    }
    PairwiseSubscriber.prototype._next = function (value) {
        if (this.hasPrev) {
            this.destination.next([this.prev, value]);
        } else {
            this.hasPrev = true;
        }
        this.prev = value;
    };
    return PairwiseSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=pairwise.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/sample.js
/** PURE_IMPORTS_START .._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var sample___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Emits the most recently emitted value from the source Observable whenever
 * another Observable, the `notifier`, emits.
 *
 * <span class="informal">It's like {@link sampleTime}, but samples whenever
 * the `notifier` Observable emits something.</span>
 *
 * <img src="./img/sample.png" width="100%">
 *
 * Whenever the `notifier` Observable emits a value or completes, `sample`
 * looks at the source Observable and emits whichever value it has most recently
 * emitted since the previous sampling, unless the source has not emitted
 * anything since the previous sampling. The `notifier` is subscribed to as soon
 * as the output Observable is subscribed.
 *
 * @example <caption>On every click, sample the most recent "seconds" timer</caption>
 * var seconds = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = seconds.sample(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {Observable<any>} notifier The Observable to use for sampling the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable whenever the notifier Observable
 * emits value or completes.
 * @method sample
 * @owner Observable
 */
function sample(notifier) {
    return function (source) {
        return source.lift(new sample_SampleOperator(notifier));
    };
}
var sample_SampleOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function SampleOperator(notifier) {
        this.notifier = notifier;
    }
    SampleOperator.prototype.call = function (subscriber, source) {
        var sampleSubscriber = new SampleSubscriber(subscriber);
        var subscription = source.subscribe(sampleSubscriber);
        subscription.add(subscribeToResult(sampleSubscriber, this.notifier));
        return subscription;
    };
    return SampleOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SampleSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    sample___extends(SampleSubscriber, _super);
    function SampleSubscriber() {
        _super.apply(this, arguments);
        this.hasValue = false;
    }
    SampleSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
    };
    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    SampleSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    SampleSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    };
    return SampleSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=sample.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/refCount.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var refCount___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

function refCount() {
    return function refCountOperatorFunction(source) {
        return source.lift(new RefCountOperator(source));
    };
}
var RefCountOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}();
var RefCountSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    refCount___extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    /** @deprecated internal use only */RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // Observable.range(0, 10)
        //   .publish()
        //   .refCount()
        //   .take(5)
        //   .subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=refCount.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/ConnectableObservable.js
/** PURE_IMPORTS_START .._Subject,.._Observable,.._Subscriber,.._Subscription,.._operators_refCount PURE_IMPORTS_END */
var ConnectableObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * @class ConnectableObservable<T>
 */
var ConnectableObservable_ConnectableObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ConnectableObservable___extends(ConnectableObservable, _super);
    function ConnectableObservable( /** @deprecated internal use only */source,
    /** @deprecated internal use only */subjectFactory) {
        _super.call(this);
        this.source = source;
        this.subjectFactory = subjectFactory;
        /** @deprecated internal use only */this._refCount = 0;
        this._isComplete = false;
    }
    /** @deprecated internal use only */ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    /** @deprecated internal use only */ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            this._isComplete = false;
            connection = this._connection = new Subscription_Subscription();
            connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription_Subscription.EMPTY;
            } else {
                this._connection = connection;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return refCount()(this);
    };
    return ConnectableObservable;
}(Observable_Observable);
var connectableProto = ConnectableObservable_ConnectableObservable.prototype;
var connectableObservableDescriptor = {
    operator: { value: null },
    _refCount: { value: 0, writable: true },
    _subject: { value: null, writable: true },
    _connection: { value: null, writable: true },
    _subscribe: { value: connectableProto._subscribe },
    _isComplete: { value: connectableProto._isComplete, writable: true },
    getSubject: { value: connectableProto.getSubject },
    connect: { value: connectableProto.connect },
    refCount: { value: connectableProto.refCount }
};
var ConnectableSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ConnectableObservable___extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
        this.connectable._isComplete = true;
        this._unsubscribe();
        _super.prototype._complete.call(this);
    };
    /** @deprecated internal use only */ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(SubjectSubscriber);
var ConnectableObservable_RefCountOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new ConnectableObservable_RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}();
var ConnectableObservable_RefCountSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ConnectableObservable___extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    /** @deprecated internal use only */RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // Observable.range(0, 10)
        //   .publish()
        //   .refCount()
        //   .take(5)
        //   .subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=ConnectableObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/multicast.js
/** PURE_IMPORTS_START .._observable_ConnectableObservable PURE_IMPORTS_END */

/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the results of invoking a specified selector on items
 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
 *
 * <img src="./img/multicast.png" width="100%">
 *
 * @param {Function|Subject} subjectOrSubjectFactory - Factory function to create an intermediate subject through
 * which the source sequence's elements will be multicast to the selector function
 * or Subject to push source elements into.
 * @param {Function} [selector] - Optional selector function that can use the multicasted source stream
 * as many times as needed, without causing multiple subscriptions to the source stream.
 * Subscribers to the given source will receive all notifications of the source from the
 * time of the subscription forward.
 * @return {Observable} An Observable that emits the results of invoking the selector
 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
 * the underlying stream.
 * @method multicast
 * @owner Observable
 */
function multicast(subjectOrSubjectFactory, selector) {
    return function multicastOperatorFunction(source) {
        var subjectFactory;
        if (typeof subjectOrSubjectFactory === 'function') {
            subjectFactory = subjectOrSubjectFactory;
        } else {
            subjectFactory = function subjectFactory() {
                return subjectOrSubjectFactory;
            };
        }
        if (typeof selector === 'function') {
            return source.lift(new MulticastOperator(subjectFactory, selector));
        }
        var connectable = Object.create(source, connectableObservableDescriptor);
        connectable.source = source;
        connectable.subjectFactory = subjectFactory;
        return connectable;
    };
}
var MulticastOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function MulticastOperator(subjectFactory, selector) {
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    MulticastOperator.prototype.call = function (subscriber, source) {
        var selector = this.selector;
        var subject = this.subjectFactory();
        var subscription = selector(subject).subscribe(subscriber);
        subscription.add(source.subscribe(subject));
        return subscription;
    };
    return MulticastOperator;
}();
//# sourceMappingURL=multicast.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/share.js
/** PURE_IMPORTS_START ._multicast,._refCount,.._Subject PURE_IMPORTS_END */



function shareSubjectFactory() {
    return new Subject_Subject();
}
/**
 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
 * This is an alias for .multicast(() => new Subject()).refCount().
 *
 * <img src="./img/share.png" width="100%">
 *
 * @return {Observable<T>} An Observable that upon connection causes the source Observable to emit items to its Observers.
 * @method share
 * @owner Observable
 */
function share() {
    return function (source) {
        return refCount()(multicast(shareSubjectFactory)(source));
    };
}
;
//# sourceMappingURL=share.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/skip.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var skip___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Returns an Observable that skips the first `count` items emitted by the source Observable.
 *
 * <img src="./img/skip.png" width="100%">
 *
 * @param {Number} count - The number of times, items emitted by source Observable should be skipped.
 * @return {Observable} An Observable that skips values emitted by the source Observable.
 *
 * @method skip
 * @owner Observable
 */
function skip(count) {
    return function (source) {
        return source.lift(new SkipOperator(count));
    };
}
var SkipOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function SkipOperator(total) {
        this.total = total;
    }
    SkipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipSubscriber(subscriber, this.total));
    };
    return SkipOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    skip___extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    SkipSubscriber.prototype._next = function (x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    };
    return SkipSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=skip.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/of.js
/** PURE_IMPORTS_START ._ArrayObservable PURE_IMPORTS_END */

var of = ArrayObservable_ArrayObservable.of;
//# sourceMappingURL=of.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/PromiseObservable.js
/** PURE_IMPORTS_START .._util_root,.._Observable PURE_IMPORTS_END */
var PromiseObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var PromiseObservable_PromiseObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    PromiseObservable___extends(PromiseObservable, _super);
    function PromiseObservable(promise, scheduler) {
        _super.call(this);
        this.promise = promise;
        this.scheduler = scheduler;
    }
    /**
     * Converts a Promise to an Observable.
     *
     * <span class="informal">Returns an Observable that just emits the Promise's
     * resolved value, then completes.</span>
     *
     * Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an
     * Observable. If the Promise resolves with a value, the output Observable
     * emits that resolved value as a `next`, and then completes. If the Promise
     * is rejected, then the output Observable emits the corresponding Error.
     *
     * @example <caption>Convert the Promise returned by Fetch to an Observable</caption>
     * var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindCallback}
     * @see {@link from}
     *
     * @param {PromiseLike<T>} promise The promise to be converted.
     * @param {Scheduler} [scheduler] An optional IScheduler to use for scheduling
     * the delivery of the resolved value (or the rejection).
     * @return {Observable<T>} An Observable which wraps the Promise.
     * @static true
     * @name fromPromise
     * @owner Observable
     */
    PromiseObservable.create = function (promise, scheduler) {
        return new PromiseObservable(promise, scheduler);
    };
    /** @deprecated internal use only */PromiseObservable.prototype._subscribe = function (subscriber) {
        var _this = this;
        var promise = this.promise;
        var scheduler = this.scheduler;
        if (scheduler == null) {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    subscriber.next(this.value);
                    subscriber.complete();
                }
            } else {
                promise.then(function (value) {
                    _this.value = value;
                    _this._isScalar = true;
                    if (!subscriber.closed) {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                }, function (err) {
                    if (!subscriber.closed) {
                        subscriber.error(err);
                    }
                }).then(null, function (err) {
                    // escape the promise trap, throw unhandled errors
                    root["a" /* root */].setTimeout(function () {
                        throw err;
                    });
                });
            }
        } else {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    return scheduler.schedule(dispatchNext, 0, { value: this.value, subscriber: subscriber });
                }
            } else {
                promise.then(function (value) {
                    _this.value = value;
                    _this._isScalar = true;
                    if (!subscriber.closed) {
                        subscriber.add(scheduler.schedule(dispatchNext, 0, { value: value, subscriber: subscriber }));
                    }
                }, function (err) {
                    if (!subscriber.closed) {
                        subscriber.add(scheduler.schedule(dispatchError, 0, { err: err, subscriber: subscriber }));
                    }
                }).then(null, function (err) {
                    // escape the promise trap, throw unhandled errors
                    root["a" /* root */].setTimeout(function () {
                        throw err;
                    });
                });
            }
        }
    };
    return PromiseObservable;
}(Observable_Observable);
function dispatchNext(arg) {
    var value = arg.value,
        subscriber = arg.subscriber;
    if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
    }
}
function dispatchError(arg) {
    var err = arg.err,
        subscriber = arg.subscriber;
    if (!subscriber.closed) {
        subscriber.error(err);
    }
}
//# sourceMappingURL=PromiseObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/IteratorObservable.js
/** PURE_IMPORTS_START .._util_root,.._Observable,.._symbol_iterator PURE_IMPORTS_END */
var IteratorObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var IteratorObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    IteratorObservable___extends(IteratorObservable, _super);
    function IteratorObservable(iterator, scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
        if (iterator == null) {
            throw new Error('iterator cannot be null.');
        }
        this.iterator = getIterator(iterator);
    }
    IteratorObservable.create = function (iterator, scheduler) {
        return new IteratorObservable(iterator, scheduler);
    };
    IteratorObservable.dispatch = function (state) {
        var index = state.index,
            hasError = state.hasError,
            iterator = state.iterator,
            subscriber = state.subscriber;
        if (hasError) {
            subscriber.error(state.error);
            return;
        }
        var result = iterator.next();
        if (result.done) {
            subscriber.complete();
            return;
        }
        subscriber.next(result.value);
        state.index = index + 1;
        if (subscriber.closed) {
            if (typeof iterator.return === 'function') {
                iterator.return();
            }
            return;
        }
        this.schedule(state);
    };
    /** @deprecated internal use only */IteratorObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this,
            iterator = _a.iterator,
            scheduler = _a.scheduler;
        if (scheduler) {
            return scheduler.schedule(IteratorObservable.dispatch, 0, {
                index: index, iterator: iterator, subscriber: subscriber
            });
        } else {
            do {
                var result = iterator.next();
                if (result.done) {
                    subscriber.complete();
                    break;
                } else {
                    subscriber.next(result.value);
                }
                if (subscriber.closed) {
                    if (typeof iterator.return === 'function') {
                        iterator.return();
                    }
                    break;
                }
            } while (true);
        }
    };
    return IteratorObservable;
}(Observable_Observable);
var IteratorObservable_StringIterator = /*@__PURE__*/ /*@__PURE__*/function () {
    function StringIterator(str, idx, len) {
        if (idx === void 0) {
            idx = 0;
        }
        if (len === void 0) {
            len = str.length;
        }
        this.str = str;
        this.idx = idx;
        this.len = len;
    }
    StringIterator.prototype[iterator_iterator] = function () {
        return this;
    };
    StringIterator.prototype.next = function () {
        return this.idx < this.len ? {
            done: false,
            value: this.str.charAt(this.idx++)
        } : {
            done: true,
            value: undefined
        };
    };
    return StringIterator;
}();
var IteratorObservable_ArrayIterator = /*@__PURE__*/ /*@__PURE__*/function () {
    function ArrayIterator(arr, idx, len) {
        if (idx === void 0) {
            idx = 0;
        }
        if (len === void 0) {
            len = toLength(arr);
        }
        this.arr = arr;
        this.idx = idx;
        this.len = len;
    }
    ArrayIterator.prototype[iterator_iterator] = function () {
        return this;
    };
    ArrayIterator.prototype.next = function () {
        return this.idx < this.len ? {
            done: false,
            value: this.arr[this.idx++]
        } : {
            done: true,
            value: undefined
        };
    };
    return ArrayIterator;
}();
function getIterator(obj) {
    var i = obj[iterator_iterator];
    if (!i && typeof obj === 'string') {
        return new IteratorObservable_StringIterator(obj);
    }
    if (!i && obj.length !== undefined) {
        return new IteratorObservable_ArrayIterator(obj);
    }
    if (!i) {
        throw new TypeError('object is not iterable');
    }
    return obj[iterator_iterator]();
}
var maxSafeInteger = /*@__PURE__*/Math.pow(2, 53) - 1;
function toLength(o) {
    var len = +o.length;
    if (isNaN(len)) {
        return 0;
    }
    if (len === 0 || !numberIsFinite(len)) {
        return len;
    }
    len = sign(len) * Math.floor(Math.abs(len));
    if (len <= 0) {
        return 0;
    }
    if (len > maxSafeInteger) {
        return maxSafeInteger;
    }
    return len;
}
function numberIsFinite(value) {
    return typeof value === 'number' && root["a" /* root */].isFinite(value);
}
function sign(value) {
    var valueAsNumber = +value;
    if (valueAsNumber === 0) {
        return valueAsNumber;
    }
    if (isNaN(valueAsNumber)) {
        return valueAsNumber;
    }
    return valueAsNumber < 0 ? -1 : 1;
}
//# sourceMappingURL=IteratorObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/ArrayLikeObservable.js
/** PURE_IMPORTS_START .._Observable,._ScalarObservable,._EmptyObservable PURE_IMPORTS_END */
var ArrayLikeObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ArrayLikeObservable_ArrayLikeObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ArrayLikeObservable___extends(ArrayLikeObservable, _super);
    function ArrayLikeObservable(arrayLike, scheduler) {
        _super.call(this);
        this.arrayLike = arrayLike;
        this.scheduler = scheduler;
        if (!scheduler && arrayLike.length === 1) {
            this._isScalar = true;
            this.value = arrayLike[0];
        }
    }
    ArrayLikeObservable.create = function (arrayLike, scheduler) {
        var length = arrayLike.length;
        if (length === 0) {
            return new EmptyObservable();
        } else if (length === 1) {
            return new ScalarObservable(arrayLike[0], scheduler);
        } else {
            return new ArrayLikeObservable(arrayLike, scheduler);
        }
    };
    ArrayLikeObservable.dispatch = function (state) {
        var arrayLike = state.arrayLike,
            index = state.index,
            length = state.length,
            subscriber = state.subscriber;
        if (subscriber.closed) {
            return;
        }
        if (index >= length) {
            subscriber.complete();
            return;
        }
        subscriber.next(arrayLike[index]);
        state.index = index + 1;
        this.schedule(state);
    };
    /** @deprecated internal use only */ArrayLikeObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this,
            arrayLike = _a.arrayLike,
            scheduler = _a.scheduler;
        var length = arrayLike.length;
        if (scheduler) {
            return scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
                arrayLike: arrayLike, index: index, length: length, subscriber: subscriber
            });
        } else {
            for (var i = 0; i < length && !subscriber.closed; i++) {
                subscriber.next(arrayLike[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayLikeObservable;
}(Observable_Observable);
//# sourceMappingURL=ArrayLikeObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/FromObservable.js
var FromObservable__typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** PURE_IMPORTS_START .._util_isArray,.._util_isArrayLike,.._util_isPromise,._PromiseObservable,._IteratorObservable,._ArrayObservable,._ArrayLikeObservable,.._symbol_iterator,.._Observable,.._operators_observeOn,.._symbol_observable PURE_IMPORTS_END */
var FromObservable___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};











/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var FromObservable_FromObservable = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    FromObservable___extends(FromObservable, _super);
    function FromObservable(ish, scheduler) {
        _super.call(this, null);
        this.ish = ish;
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable from an Array, an array-like object, a Promise, an
     * iterable object, or an Observable-like object.
     *
     * <span class="informal">Converts almost anything to an Observable.</span>
     *
     * <img src="./img/from.png" width="100%">
     *
     * Convert various other objects and data types into Observables. `from`
     * converts a Promise or an array-like or an
     * [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
     * object into an Observable that emits the items in that promise or array or
     * iterable. A String, in this context, is treated as an array of characters.
     * Observable-like objects (contains a function named with the ES2015 Symbol
     * for Observable) can also be converted through this operator.
     *
     * @example <caption>Converts an array to an Observable</caption>
     * var array = [10, 20, 30];
     * var result = Rx.Observable.from(array);
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following:
     * // 10 20 30
     *
     * @example <caption>Convert an infinite iterable (from a generator) to an Observable</caption>
     * function* generateDoubles(seed) {
     *   var i = seed;
     *   while (true) {
     *     yield i;
     *     i = 2 * i; // double it
     *   }
     * }
     *
     * var iterator = generateDoubles(3);
     * var result = Rx.Observable.from(iterator).take(10);
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following:
     * // 3 6 12 24 48 96 192 384 768 1536
     *
     * @see {@link create}
     * @see {@link fromEvent}
     * @see {@link fromEventPattern}
     * @see {@link fromPromise}
     *
     * @param {ObservableInput<T>} ish A subscribable object, a Promise, an
     * Observable-like, an Array, an iterable or an array-like object to be
     * converted.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * emissions of values.
     * @return {Observable<T>} The Observable whose values are originally from the
     * input object that was converted.
     * @static true
     * @name from
     * @owner Observable
     */
    FromObservable.create = function (ish, scheduler) {
        if (ish != null) {
            if (typeof ish[observable_observable] === 'function') {
                if (ish instanceof Observable_Observable && !scheduler) {
                    return ish;
                }
                return new FromObservable(ish, scheduler);
            } else if (isArray(ish)) {
                return new ArrayObservable_ArrayObservable(ish, scheduler);
            } else if (isPromise(ish)) {
                return new PromiseObservable_PromiseObservable(ish, scheduler);
            } else if (typeof ish[iterator_iterator] === 'function' || typeof ish === 'string') {
                return new IteratorObservable(ish, scheduler);
            } else if (isArrayLike(ish)) {
                return new ArrayLikeObservable_ArrayLikeObservable(ish, scheduler);
            }
        }
        throw new TypeError((ish !== null && (typeof ish === 'undefined' ? 'undefined' : FromObservable__typeof(ish)) || ish) + ' is not observable');
    };
    /** @deprecated internal use only */FromObservable.prototype._subscribe = function (subscriber) {
        var ish = this.ish;
        var scheduler = this.scheduler;
        if (scheduler == null) {
            return ish[observable_observable]().subscribe(subscriber);
        } else {
            return ish[observable_observable]().subscribe(new observeOn_ObserveOnSubscriber(subscriber, scheduler, 0));
        }
    };
    return FromObservable;
}(Observable_Observable);
//# sourceMappingURL=FromObservable.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/from.js
/** PURE_IMPORTS_START ._FromObservable PURE_IMPORTS_END */

var from = FromObservable_FromObservable.create;
//# sourceMappingURL=from.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/concatAll.js
/** PURE_IMPORTS_START ._mergeAll PURE_IMPORTS_END */

/**
 * Converts a higher-order Observable into a first-order Observable by
 * concatenating the inner Observables in order.
 *
 * <span class="informal">Flattens an Observable-of-Observables by putting one
 * inner Observable after the other.</span>
 *
 * <img src="./img/concatAll.png" width="100%">
 *
 * Joins every Observable emitted by the source (a higher-order Observable), in
 * a serial fashion. It subscribes to each inner Observable only after the
 * previous inner Observable has completed, and merges all of their values into
 * the returned observable.
 *
 * __Warning:__ If the source Observable emits Observables quickly and
 * endlessly, and the inner Observables it emits generally complete slower than
 * the source emits, you can run into memory issues as the incoming Observables
 * collect in an unbounded buffer.
 *
 * Note: `concatAll` is equivalent to `mergeAll` with concurrency parameter set
 * to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map(ev => Rx.Observable.interval(1000).take(4));
 * var firstOrder = higherOrder.concatAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // (results are not concurrent)
 * // For every click on the "document" it will emit values 0 to 3 spaced
 * // on a 1000ms interval
 * // one click = 1000ms-> 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3
 *
 * @see {@link combineAll}
 * @see {@link concat}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 * @see {@link exhaust}
 * @see {@link mergeAll}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @return {Observable} An Observable emitting values from all the inner
 * Observables concatenated.
 * @method concatAll
 * @owner Observable
 */
function concatAll() {
  return mergeAll(1);
}
//# sourceMappingURL=concatAll.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/observable/concat.js
/** PURE_IMPORTS_START .._util_isScheduler,._of,._from,.._operators_concatAll PURE_IMPORTS_END */




/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from given
 * Observable and then moves on to the next.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * `concat` joins multiple Observables together, by subscribing to them one at a time and
 * merging their results into the output Observable. You can pass either an array of
 * Observables, or put them directly as arguments. Passing an empty array will result
 * in Observable that completes immediately.
 *
 * `concat` will subscribe to first input Observable and emit all its values, without
 * changing or affecting them in any way. When that Observable completes, it will
 * subscribe to then next Observable passed and, again, emit its values. This will be
 * repeated, until the operator runs out of Observables. When last input Observable completes,
 * `concat` will complete as well. At any given moment only one Observable passed to operator
 * emits values. If you would like to emit values from passed Observables concurrently, check out
 * {@link merge} instead, especially with optional `concurrent` parameter. As a matter of fact,
 * `concat` is an equivalent of `merge` operator with `concurrent` parameter set to `1`.
 *
 * Note that if some input Observable never completes, `concat` will also never complete
 * and Observables following the one that did not complete will never be subscribed. On the other
 * hand, if some Observable simply completes immediately after it is subscribed, it will be
 * invisible for `concat`, which will just move on to the next Observable.
 *
 * If any Observable in chain errors, instead of passing control to the next Observable,
 * `concat` will error immediately as well. Observables that would be subscribed after
 * the one that emitted error, never will.
 *
 * If you pass to `concat` the same Observable many times, its stream of values
 * will be "replayed" on every subscription, which means you can repeat given Observable
 * as many times as you like. If passing the same Observable to `concat` 1000 times becomes tedious,
 * you can always use {@link repeat}.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = Rx.Observable.concat(timer, sequence);
 * result.subscribe(x => console.log(x));
 *
 * // results in:
 * // 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
 *
 *
 * @example <caption>Concatenate an array of 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = Rx.Observable.concat([timer1, timer2, timer3]); // note that array is passed
 * result.subscribe(x => console.log(x));
 *
 * // results in the following:
 * // (Prints to console sequentially)
 * // -1000ms-> 0 -1000ms-> 1 -1000ms-> ... 9
 * // -2000ms-> 0 -2000ms-> 1 -2000ms-> ... 5
 * // -500ms-> 0 -500ms-> 1 -500ms-> ... 9
 *
 *
 * @example <caption>Concatenate the same Observable to repeat it</caption>
 * const timer = Rx.Observable.interval(1000).take(2);
 *
 * Rx.Observable.concat(timer, timer) // concating the same Observable!
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('...and it is done!')
 * );
 *
 * // Logs:
 * // 0 after 1s
 * // 1 after 2s
 * // 0 after 3s
 * // 1 after 4s
 * // "...and it is done!" also after 4s
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {ObservableInput} input1 An input Observable to concatenate with others.
 * @param {ObservableInput} input2 An input Observable to concatenate with others.
 * More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional IScheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @static true
 * @name concat
 * @owner Observable
 */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    if (observables.length === 1 || observables.length === 2 && isScheduler(observables[1])) {
        return from(observables[0]);
    }
    return concatAll()(of.apply(void 0, observables));
}
//# sourceMappingURL=concat.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/startWith.js
/** PURE_IMPORTS_START .._observable_ArrayObservable,.._observable_ScalarObservable,.._observable_EmptyObservable,.._observable_concat,.._util_isScheduler PURE_IMPORTS_END */





/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the items you specify as arguments before it begins to emit
 * items emitted by the source Observable.
 *
 * <img src="./img/startWith.png" width="100%">
 *
 * @param {...T} values - Items you want the modified Observable to emit first.
 * @param {Scheduler} [scheduler] - A {@link IScheduler} to use for scheduling
 * the emissions of the `next` notifications.
 * @return {Observable} An Observable that emits the items in the specified Iterable and then emits the items
 * emitted by the source Observable.
 * @method startWith
 * @owner Observable
 */
function startWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i - 0] = arguments[_i];
    }
    return function (source) {
        var scheduler = array[array.length - 1];
        if (isScheduler(scheduler)) {
            array.pop();
        } else {
            scheduler = null;
        }
        var len = array.length;
        if (len === 1) {
            return concat(new ScalarObservable(array[0], scheduler), source);
        } else if (len > 1) {
            return concat(new ArrayObservable_ArrayObservable(array, scheduler), source);
        } else {
            return concat(new EmptyObservable(scheduler), source);
        }
    };
}
//# sourceMappingURL=startWith.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/switchMap.js
/** PURE_IMPORTS_START .._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var switchMap___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, emitting values only from the most recently projected Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link switch}.</span>
 *
 * <img src="./img/switchMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each time it observes one of these
 * inner Observables, the output Observable begins emitting the items emitted by
 * that inner Observable. When a new inner Observable is emitted, `switchMap`
 * stops emitting items from the earlier-emitted inner Observable and begins
 * emitting items from the new one. It continues to behave like this for
 * subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switch}
 * @see {@link switchMapTo}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method switchMap
 * @owner Observable
 */
function switchMap(project, resultSelector) {
    return function switchMapOperatorFunction(source) {
        return source.lift(new SwitchMapOperator(project, resultSelector));
    };
}
var SwitchMapOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function SwitchMapOperator(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    SwitchMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new switchMap_SwitchMapSubscriber(subscriber, this.project, this.resultSelector));
    };
    return SwitchMapOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var switchMap_SwitchMapSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    switchMap___extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project, resultSelector) {
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        } catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = subscribeToResult(this, result, value, index));
    };
    SwitchMapSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.closed) {
            _super.prototype._complete.call(this);
        }
    };
    /** @deprecated internal use only */SwitchMapSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
        } else {
            this.destination.next(innerValue);
        }
    };
    SwitchMapSubscriber.prototype._tryNotifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return SwitchMapSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=switchMap.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/takeUntil.js
/** PURE_IMPORTS_START .._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var takeUntil___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits something. Then, it completes.</span>
 *
 * <img src="./img/takeUntil.png" width="100%">
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value or a complete notification, the output Observable stops
 * mirroring the source Observable and completes.
 *
 * @example <caption>Tick every second until the first click happens</caption>
 * var interval = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = interval.takeUntil(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable until such time as `notifier` emits its first value.
 * @method takeUntil
 * @owner Observable
 */
function takeUntil(notifier) {
    return function (source) {
        return source.lift(new TakeUntilOperator(notifier));
    };
}
var TakeUntilOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new takeUntil_TakeUntilSubscriber(subscriber, this.notifier));
    };
    return TakeUntilOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var takeUntil_TakeUntilSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    takeUntil___extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination, notifier) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.add(subscribeToResult(this, notifier));
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    return TakeUntilSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=takeUntil.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/scheduler/async.js
/** PURE_IMPORTS_START ._AsyncAction,._AsyncScheduler PURE_IMPORTS_END */


/**
 *
 * Async Scheduler
 *
 * <span class="informal">Schedule task as if you used setTimeout(task, duration)</span>
 *
 * `async` scheduler schedules tasks asynchronously, by putting them on the JavaScript
 * event loop queue. It is best used to delay tasks in time or to schedule tasks repeating
 * in intervals.
 *
 * If you just want to "defer" task, that is to perform it right after currently
 * executing synchronous code ends (commonly achieved by `setTimeout(deferredTask, 0)`),
 * better choice will be the {@link asap} scheduler.
 *
 * @example <caption>Use async scheduler to delay task</caption>
 * const task = () => console.log('it works!');
 *
 * Rx.Scheduler.async.schedule(task, 2000);
 *
 * // After 2 seconds logs:
 * // "it works!"
 *
 *
 * @example <caption>Use async scheduler to repeat task in intervals</caption>
 * function task(state) {
 *   console.log(state);
 *   this.schedule(state + 1, 1000); // `this` references currently executing Action,
 *                                   // which we reschedule with new state and delay
 * }
 *
 * Rx.Scheduler.async.schedule(task, 3000, 0);
 *
 * // Logs:
 * // 0 after 3s
 * // 1 after 4s
 * // 2 after 5s
 * // 3 after 6s
 *
 * @static true
 * @name async
 * @owner Scheduler
 */
var async_async = /*@__PURE__*/new AsyncScheduler(AsyncAction_AsyncAction);
//# sourceMappingURL=async.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/timestamp.js
/** PURE_IMPORTS_START .._scheduler_async,._map PURE_IMPORTS_END */


/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
function timestamp(scheduler) {
    if (scheduler === void 0) {
        scheduler = async_async;
    }
    return map(function (value) {
        return new Timestamp(value, scheduler.now());
    });
    // return (source: Observable<T>) => source.lift(new TimestampOperator(scheduler));
}
var Timestamp = /*@__PURE__*/ /*@__PURE__*/function () {
    function Timestamp(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
    return Timestamp;
}();
;
//# sourceMappingURL=timestamp.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/withLatestFrom.js
/** PURE_IMPORTS_START .._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var withLatestFrom___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/* tslint:enable:max-line-length */
/**
 * Combines the source Observable with other Observables to create an Observable
 * whose values are calculated from the latest values of each, only when the
 * source emits.
 *
 * <span class="informal">Whenever the source Observable emits a value, it
 * computes a formula using that value plus the latest values from other input
 * Observables, then emits the output of that formula.</span>
 *
 * <img src="./img/withLatestFrom.png" width="100%">
 *
 * `withLatestFrom` combines each value from the source Observable (the
 * instance) with the latest values from the other input Observables only when
 * the source emits a value, optionally using a `project` function to determine
 * the value to be emitted on the output Observable. All input Observables must
 * emit at least one value before the output Observable will emit a value.
 *
 * @example <caption>On every click event, emit an array with the latest timer event plus the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var result = clicks.withLatestFrom(timer);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineLatest}
 *
 * @param {ObservableInput} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Function} [project] Projection function for combining values
 * together. Receives all values in order of the Observables passed, where the
 * first parameter is a value from the source Observable. (e.g.
 * `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not
 * passed, arrays will be emitted on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method withLatestFrom
 * @owner Observable
 */
function withLatestFrom() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return function (source) {
        var project;
        if (typeof args[args.length - 1] === 'function') {
            project = args.pop();
        }
        var observables = args;
        return source.lift(new WithLatestFromOperator(observables, project));
    };
}
var WithLatestFromOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function WithLatestFromOperator(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    WithLatestFromOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new withLatestFrom_WithLatestFromSubscriber(subscriber, this.observables, this.project));
    };
    return WithLatestFromOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var withLatestFrom_WithLatestFromSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    withLatestFrom___extends(WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
        _super.call(this, destination);
        this.observables = observables;
        this.project = project;
        this.toRespond = [];
        var len = observables.length;
        this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            this.toRespond.push(i);
        }
        for (var i = 0; i < len; i++) {
            var observable = observables[i];
            this.add(subscribeToResult(this, observable, observable, i));
        }
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        var toRespond = this.toRespond;
        if (toRespond.length > 0) {
            var found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    WithLatestFromSubscriber.prototype._next = function (value) {
        if (this.toRespond.length === 0) {
            var args = [value].concat(this.values);
            if (this.project) {
                this._tryProject(args);
            } else {
                this.destination.next(args);
            }
        }
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return WithLatestFromSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=withLatestFrom.js.map
// CONCATENATED MODULE: ./node_modules/rxjs-create-tween/esm/index.js
 // eslint-disable-line

/**
 * Creates an observable that emits samples from an easing function on every animation frame
 * for a duration `d` ms.
 *
 * The first value will be emitted on the next animation frame,
 * and is the value of the easing function at `t = 0`.
 * The final value is guaranteed to be the easing function at `t = d`.
 * The observable completes one frame after the final value was emitted.
 *
 * @param {function(t: number, b: number, c: number, d: number, [s]: number): number} easingFunction
 * - the easing fuction to sample from; can use any of Robert Penner's easing functions
     (without the `x` paramter)
 * @param {number} b - beginning value and 2nd parameter of the easing function
 * @param {number} c - change in value (or end value) and 3rd parameter of the easing function
 * @param {number} d - total duration of the tween in ms and 4th parameter of the easing function
 * @param {number} [s] - 5th parameter of the easing function (optional)
 * @return {Observable<number>} - an observable emitting samples of the easing function on
 *   animation frames for `d` ms.
 */
function createTween(easingFunction, b, c, d, s) {
  return Observable_Observable.create(function (observer) {
    var startTime = void 0;
    var id = requestAnimationFrame(function sample(time) {
      startTime = startTime || time;
      var t = time - startTime;
      if (t < d) {
        observer.next(easingFunction(t, b, c, d, s));
        id = requestAnimationFrame(sample);
      } else {
        observer.next(easingFunction(d, b, c, d, s));
        id = requestAnimationFrame(function () {
          return observer.complete();
        });
      }
    });
    return function () {
      if (id) {
        cancelAnimationFrame(id);
      }
    };
  });
}

/* harmony default export */ var esm = (createTween);
// CONCATENATED MODULE: ./src/common.js
// # src / common.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

function easeOutSine(t, b, c, d) {
  return c * Math.sin(t / d * (Math.PI / 2)) + b; // eslint-disable-line
}
// CONCATENATED MODULE: ./src/mixin/constants.js
// # src / mixin / constants.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

// The base duration of the fling animation.
var BASE_DURATION = 200;

// We adjust the duration of the animation using the width of the drawer.
// There is no physics to this, but we know from testing that the animation starts to feel bad
// when the drawer increases in size.
// From testing we know that, if we increase the duration as a fraction of the drawer width,
// the animation stays smooth across common display sizes.
var WIDTH_CONTRIBUTION = 0.15;

// Minimum velocity of the drawer (in px/ms) when releasing to make it fling to opened/closed state.
var VELOCITY_THRESHOLD = 0.15;
// CONCATENATED MODULE: ./src/mixin/operators.js
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

// # src / mixin / operators.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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








// ### Observable extensions
// #### Subscribe when
// This operator is like `filterWhen`, but it will unsubscribe from the source observable
// when the input observable emits `false`, and re-subscribe when it emits `true`.
var operators_subscribeWhen = function subscribeWhen(p$) {
  return function (source) {
    if (true && !p$) throw Error();
    return p$.pipe(switchMap(function (p) {
      return p ? source : never();
    }));
  };
};

// #### Filter when
// This operator is like `filter`, but it takes an observable of booleans as input,
// instead of a predicate function.
var operators_filterWhen = function filterWhen(p$) {
  for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    others[_key - 1] = arguments[_key];
  }

  return function (source) {
    if (true && !p$) throw Error();else if (others.length === 0) {
      return source.pipe(withLatestFrom(p$), filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            p = _ref2[1];

        return p;
      }), map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            x = _ref4[0];

        return x;
      }));

      // When providing more than one observable, the result observable will only emit values
      // when `every` input observable has emitted a truthy value.
    } else {
      return source.pipe(withLatestFrom.apply(undefined, [p$].concat(others)), filter(function (_ref5) {
        var _ref6 = _toArray(_ref5),
            ps = _ref6.slice(1);

        return ps.every(function (p) {
          return p;
        });
      }), map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 1),
            x = _ref8[0];

        return x;
      }));
    }
  };
};
// CONCATENATED MODULE: ./src/mixin/calc.js
var calc__slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var calc__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function calc__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function calc__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function calc__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// # src / mixin / calc.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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



// Using shorthands for common functions
var min = Math.min.bind(Math);
var max = Math.max.bind(Math);

var calc_calcMixin = function calcMixin(C) {
  return function (_C) {
    calc__inherits(_class, _C);

    function _class() {
      calc__classCallCheck(this, _class);

      return calc__possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    calc__createClass(_class, [{
      key: "calcIsInRange",

      // #### Is in range?
      // Given a x-coordinate, `isInRange` will  determine whether it is within range from where
      // to pull the drawer. The x-coordinate *must* be larger than the lower bound,
      // but when the drawer is opened it may be anywhere on the screen.
      // Otherwise it must be below the upper bound.
      value: function calcIsInRange(clientX, opened) {
        switch (this.align) {
          case "left":
            return clientX > this.range[0] && (opened || clientX < this.range[1]);
          case "right":
            return clientX < window.innerWidth - this.range[0] && (opened || clientX > window.innerWidth - this.range[1]);
          default:
            throw Error();
        }
      }

      // #### Calculate 'Is swipe?'
      // If the start and end position are not the same x-coordinate, we call it a 'swipe'.
      // However, if a tap occures during an animation (i.e. `translateX` not in a resting position)
      // we treat it as a swipe as well. The reasons for this are pretty complex:
      // Basically, we want users the be able to stop the animation by putting a finger on the screen.
      // However, if they lift the finger again without swiping, the animation would not continue,
      // because it would not pass the condition below, unless we introduce the second term.
      // TODO: reuse isSlidign observable?

    }, {
      key: "calcIsSwipe",
      value: function calcIsSwipe(_ref) {
        var _ref2 = calc__slicedToArray(_ref, 3),
            endX = _ref2[0].clientX,
            startX = _ref2[1].clientX,
            translateX = _ref2[2];

        return endX !== startX || translateX > 0 && translateX < this.drawerWidth;
      }

      // #### Calculate 'Will open?'
      // Based on current velocity and position of the drawer,
      // should the drawer slide open, or snap back?
      // TODO: could incorporate the current open state of the drawer.

    }, {
      key: "calcWillOpen",
      value: function calcWillOpen(_ref3) {
        var _ref4 = calc__slicedToArray(_ref3, 4),
            translateX = _ref4[2],
            velocity = _ref4[3];

        switch (this.align) {
          case "left":
            {
              if (velocity > VELOCITY_THRESHOLD) return true;else if (velocity < -VELOCITY_THRESHOLD) return false;else if (translateX >= this.drawerWidth / 2) return true;else return false;
            }
          case "right":
            {
              if (-velocity > VELOCITY_THRESHOLD) return true;else if (-velocity < -VELOCITY_THRESHOLD) return false;else if (translateX <= -this.drawerWidth / 2) return true;else return false;
            }
          default:
            throw Error();
        }
      }

      // #### Calculate translate X
      // Calcuate the current position of the drawer,
      // by taking the difference between the current and starting postion of the finger,
      // then adding that difference to the starting position of the drawer.
      // This way, we avoid the drawer jumping to the finger, when "catching" it during an animation.
      // The function will also clip the position at 0 and the width of the drawer.

    }, {
      key: "calcTranslateX",
      value: function calcTranslateX(clientX, startX, startTranslateX) {
        switch (this.align) {
          case "left":
            {
              var deltaX = clientX - startX;
              var translateX = startTranslateX + deltaX;
              return max(0, min(this.drawerWidth, translateX));
            }
          case "right":
            {
              var _deltaX = clientX - startX;
              var _translateX = startTranslateX + _deltaX;
              return min(0, max(-this.drawerWidth, _translateX));
            }
          default:
            throw Error();
        }
      }

      // #### Get movable drawer width
      // One feature of hy-drawer is to allow the drawer to "peek" over the edge.
      // This effect is achieved by setting a smaller negative `left` (`right`) CSS property,
      // than is the width of the drawer,
      // The 'moveable' part of the drawer, then, is equal to the inverse of that property.
      // See [Styling](../../styling.md) for more.

    }, {
      key: "calcMovableDrawerWidth",
      value: function calcMovableDrawerWidth() {
        return -parseFloat(getComputedStyle(this.contentEl)[this.align]);
      }
    }]);

    return _class;
  }(C);
};
// CONCATENATED MODULE: ./src/mixin/update.js
var update__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function update__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function update__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function update__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// # src / mixin / update.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

var hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && CSS.number;

var updateMixin = function updateMixin(C) {
  return function (_C) {
    update__inherits(_class, _C);

    function _class() {
      update__classCallCheck(this, _class);

      return update__possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    update__createClass(_class, [{
      key: "histId",
      value: function histId() {
        return this.el.id || this.constructor.componentName;
      }

      // #### Prepare and cleanup interaction
      // `prepareInteraction` causes various side effects before sliding the drawer.
      //
      // Note that the drawer receives the `hy-drawer-opened` CSS class when it is opened.
      // This class makes the drawer appear open by setting the CSS `left` (`right`) property, instead
      // of an absoulte `transform` value.
      // This way, the drawer's width can change while it is open without having to
      // recalculate `translateX` on every `resize`.
      // However, it has to be removed before we move the drawer via `translateX` again.

    }, {
      key: "prepareInteraction",
      value: function prepareInteraction() {
        if (hasCSSOM) {
          this.contentEl.attributeStyleMap.set("will-change", "transform");
          this.scrimEl.attributeStyleMap.set("will-change", "opacity");
        } else {
          this.contentEl.style.willChange = "transform";
          this.scrimEl.style.willChange = "opacity";
        }
        this.contentEl.classList.remove("hy-drawer-opened");
        this.fireEvent("prepare");
      }

      // Cleanup code after a completed interaction.
      // Will add/remove the beforementioned `hy-drawer-opened` class.

    }, {
      key: "cleanupInteraction",
      value: function cleanupInteraction(opened) {
        if (hasCSSOM) {
          this.contentEl.attributeStyleMap.delete("will-change");
          this.scrimEl.attributeStyleMap.delete("will-change");

          if (opened) {
            this.scrimEl.attributeStyleMap.set("pointer-events", new CSSKeywordValue("all"));
            this.contentEl.classList.add("hy-drawer-opened");
          } else {
            this.scrimEl.attributeStyleMap.delete("pointer-events");
            this.contentEl.classList.remove("hy-drawer-opened");
          }
        } else {
          this.scrimEl.style.willChange = "";
          this.contentEl.style.willChange = "";

          if (opened) {
            this.scrimEl.style.pointerEvents = "all";
            this.contentEl.classList.add("hy-drawer-opened");
          } else {
            this.scrimEl.style.pointerEvents = "";
            this.contentEl.classList.remove("hy-drawer-opened");
          }
        }

        // If the experimental back button feature is enabled we hack the history API,
        // so that it matches the state of the drawer...
        /*
        if (this._backButton) {
          const id = histId.call(this);
          const hash = `#${id}--opened`;
           if (opened && window.location.hash !== hash) {
            window.history.pushState({ [id]: true }, document.title, hash);
          }
           if (!opened
              && (window.history.state && window.history.state[histId.call(this)])
              && window.location.hash !== '') {
            window.history.back();
          }
        }
        */

        // Once we're finished cleaning up, we fire the `transitioned` event.
        this.fireEvent("transitioned", { detail: opened });
      }
      // #### Update DOM
      // In the end, we only modify two properties: The x-coordinate of the drawer,
      // and the opacity of the scrim, which is handled by `updateDOM`.

    }, {
      key: "updateDOM",
      value: function updateDOM(translateX) {
        this.translateX = translateX;

        var inv = this.align === "left" ? 1 : -1;
        var opacity = this.opacity = translateX / this.drawerWidth * inv;

        if (this.moveCallback) this.moveCallback({ translateX: translateX, opacity: opacity });
        /* this.fireEvent("move", { detail: { translateX, opacity } }); */

        if (hasCSSOM) {
          this.contentEl.attributeStyleMap.set("transform", new CSSTransformValue([new CSSTranslate(CSS.px(translateX), CSS.px(0))]));
          this.scrimEl.attributeStyleMap.set("opacity", this.opacity);
        } else {
          this.contentEl.style.transform = "translateX(" + translateX + "px)";
          this.scrimEl.style.opacity = this.opacity;
        }
      }
    }]);

    return _class;
  }(C);
};
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/mapTo.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var mapTo___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Emits the given constant value on the output Observable every time the source
 * Observable emits a value.
 *
 * <span class="informal">Like {@link map}, but it maps every source value to
 * the same output value every time.</span>
 *
 * <img src="./img/mapTo.png" width="100%">
 *
 * Takes a constant `value` as argument, and emits that whenever the source
 * Observable emits a value. In other words, ignores the actual source value,
 * and simply uses the emission moment to know when to emit the given `value`.
 *
 * @example <caption>Map every click to the string 'Hi'</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var greetings = clicks.mapTo('Hi');
 * greetings.subscribe(x => console.log(x));
 *
 * @see {@link map}
 *
 * @param {any} value The value to map each source value to.
 * @return {Observable} An Observable that emits the given `value` every time
 * the source Observable emits something.
 * @method mapTo
 * @owner Observable
 */
function mapTo(value) {
    return function (source) {
        return source.lift(new MapToOperator(value));
    };
}
var MapToOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function MapToOperator(value) {
        this.value = value;
    }
    MapToOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapToSubscriber(subscriber, this.value));
    };
    return MapToOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapToSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    mapTo___extends(MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
        _super.call(this, destination);
        this.value = value;
    }
    MapToSubscriber.prototype._next = function (x) {
        this.destination.next(this.value);
    };
    return MapToSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=mapTo.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/repeatWhen.js
/** PURE_IMPORTS_START .._Subject,.._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var repeatWhen___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * Returns an Observable that mirrors the source Observable with the exception of a `complete`. If the source
 * Observable calls `complete`, this method will emit to the Observable returned from `notifier`. If that Observable
 * calls `complete` or `error`, then this method will call `complete` or `error` on the child subscription. Otherwise
 * this method will resubscribe to the source Observable.
 *
 * <img src="./img/repeatWhen.png" width="100%">
 *
 * @param {function(notifications: Observable): Observable} notifier - Receives an Observable of notifications with
 * which a user can `complete` or `error`, aborting the repetition.
 * @return {Observable} The source Observable modified with repeat logic.
 * @method repeatWhen
 * @owner Observable
 */
function repeatWhen(notifier) {
    return function (source) {
        return source.lift(new RepeatWhenOperator(notifier));
    };
}
var RepeatWhenOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function RepeatWhenOperator(notifier) {
        this.notifier = notifier;
    }
    RepeatWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new repeatWhen_RepeatWhenSubscriber(subscriber, this.notifier, source));
    };
    return RepeatWhenOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var repeatWhen_RepeatWhenSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    repeatWhen___extends(RepeatWhenSubscriber, _super);
    function RepeatWhenSubscriber(destination, notifier, source) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.source = source;
        this.sourceIsBeingSubscribedTo = true;
    }
    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
    };
    RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        if (this.sourceIsBeingSubscribedTo === false) {
            return _super.prototype.complete.call(this);
        }
    };
    RepeatWhenSubscriber.prototype.complete = function () {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
            if (!this.retries) {
                this.subscribeToRetries();
            }
            if (!this.retriesSubscription || this.retriesSubscription.closed) {
                return _super.prototype.complete.call(this);
            }
            this._unsubscribeAndRecycle();
            this.notifications.next();
        }
    };
    /** @deprecated internal use only */RepeatWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this,
            notifications = _a.notifications,
            retriesSubscription = _a.retriesSubscription;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    /** @deprecated internal use only */RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this,
            notifications = _a.notifications,
            retries = _a.retries,
            retriesSubscription = _a.retriesSubscription;
        this.notifications = null;
        this.retries = null;
        this.retriesSubscription = null;
        _super.prototype._unsubscribeAndRecycle.call(this);
        this.notifications = notifications;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        return this;
    };
    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
        this.notifications = new Subject_Subject();
        var retries = tryCatch(this.notifier)(this.notifications);
        if (retries === errorObject) {
            return _super.prototype.complete.call(this);
        }
        this.retries = retries;
        this.retriesSubscription = subscribeToResult(this, retries);
    };
    return RepeatWhenSubscriber;
}(OuterSubscriber);
//# sourceMappingURL=repeatWhen.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/skipWhile.js
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var skipWhile___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
 * true, but emits all further source items as soon as the condition becomes false.
 *
 * <img src="./img/skipWhile.png" width="100%">
 *
 * @param {Function} predicate - A function to test each item emitted from the source Observable.
 * @return {Observable<T>} An Observable that begins emitting items emitted by the source Observable when the
 * specified predicate becomes false.
 * @method skipWhile
 * @owner Observable
 */
function skipWhile(predicate) {
    return function (source) {
        return source.lift(new SkipWhileOperator(predicate));
    };
}
var SkipWhileOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function SkipWhileOperator(predicate) {
        this.predicate = predicate;
    }
    SkipWhileOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
    };
    return SkipWhileOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipWhileSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    skipWhile___extends(SkipWhileSubscriber, _super);
    function SkipWhileSubscriber(destination, predicate) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.skipping = true;
        this.index = 0;
    }
    SkipWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    };
    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
        try {
            var result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        } catch (err) {
            this.destination.error(err);
        }
    };
    return SkipWhileSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=skipWhile.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/util/ArgumentOutOfRangeError.js
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ArgumentOutOfRangeError___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an element was queried at a certain index of an
 * Observable, but no such index or position exists in that sequence.
 *
 * @see {@link elementAt}
 * @see {@link take}
 * @see {@link takeLast}
 *
 * @class ArgumentOutOfRangeError
 */
var ArgumentOutOfRangeError = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    ArgumentOutOfRangeError___extends(ArgumentOutOfRangeError, _super);
    function ArgumentOutOfRangeError() {
        var err = _super.call(this, 'argument out of range');
        this.name = err.name = 'ArgumentOutOfRangeError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return ArgumentOutOfRangeError;
}(Error);
//# sourceMappingURL=ArgumentOutOfRangeError.js.map
// CONCATENATED MODULE: ./node_modules/rxjs/_esm5/operators/take.js
/** PURE_IMPORTS_START .._Subscriber,.._util_ArgumentOutOfRangeError,.._observable_EmptyObservable PURE_IMPORTS_END */
var take___extends = this && this.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * <img src="./img/take.png" width="100%">
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
 * var interval = Rx.Observable.interval(1000);
 * var five = interval.take(5);
 * five.subscribe(x => console.log(x));
 *
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of `next` values to emit.
 * @return {Observable<T>} An Observable that emits only the first `count`
 * values emitted by the source Observable, or all of the values from the source
 * if the source emits fewer than `count` values.
 * @method take
 * @owner Observable
 */
function take(count) {
    return function (source) {
        if (count === 0) {
            return new EmptyObservable();
        } else {
            return source.lift(new take_TakeOperator(count));
        }
    };
}
var take_TakeOperator = /*@__PURE__*/ /*@__PURE__*/function () {
    function TakeOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError();
        }
    }
    TakeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeSubscriber(subscriber, this.total));
    };
    return TakeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeSubscriber = /*@__PURE__*/ /*@__PURE__*/function (_super) {
    take___extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        var count = ++this.count;
        if (count <= total) {
            this.destination.next(value);
            if (count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    };
    return TakeSubscriber;
}(Subscriber_Subscriber);
//# sourceMappingURL=take.js.map
// CONCATENATED MODULE: ./src/mixin/observables.js
var observables__slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var observables__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function observables__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function observables__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function observables__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// # src / mixin / observables.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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


















// Using shorthands for common functions
var abs = Math.abs.bind(Math);

// #### Get start observable
// The following function returns an observable of all "start" events.
// Usually, that's just `touchstart` event of the first finger touching the screen,
// however since the compontent also supports mouse events,
// we may listen for `mousedown` events.
var observables_baseObservablesMixin = function baseObservablesMixin(C) {
  return function (_C) {
    observables__inherits(_class, _C);

    function _class() {
      observables__classCallCheck(this, _class);

      return observables__possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    observables__createClass(_class, [{
      key: "getStartObservable",
      value: function getStartObservable() {
        // Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.
        return combineLatest_combineLatest(this.subjects.document, this.subjects.mouseEvents).pipe(switchMap(function (_ref) {
          var _ref2 = observables__slicedToArray(_ref, 2),
              doc = _ref2[0],
              mouseEvents = _ref2[1];

          // The touchstart observable is passive since we won't be calling `preventDefault`.
          // Also, we're only interested in the first `touchstart`.
          var touchstart$ = fromEvent(doc, "touchstart", {
            passive: true
          }).pipe(filter(function (_ref3) {
            var touches = _ref3.touches;
            return touches.length === 1;
          }), map(function (_ref4) {
            var touches = _ref4.touches;
            return touches[0];
          }));

          // If mouse events aren't enabled, we're done here.
          if (!mouseEvents) return touchstart$;

          // Otherwise we also include `mousedown` events in the output.
          var mousedown$ = fromEvent(doc, "mousedown").pipe(tap(function (event) {
            return Object.assign(event, { event: event });
          }));

          return merge(touchstart$, mousedown$);
        }));
      }

      // #### Get move observable
      // This function returns an observable of all move events. Usually that's just `touchmove`,
      // but may also include `mousemove` events while the mouse button is down.

    }, {
      key: "getMoveObservable",
      value: function getMoveObservable(start$, end$) {
        // Since the `mouseEvents` or `preventDefault` option may change at any point,
        // we `switchMap` to reflect the changes.
        // Nice: `combineLatest` provides us with the functionality of emitting
        // when either of the inputs change, but not before all inputs have their first value set.
        return combineLatest_combineLatest(this.subjects.document, this.subjects.mouseEvents, this.subjects.preventDefault).pipe(switchMap(function (_ref5) {
          var _ref6 = observables__slicedToArray(_ref5, 3),
              doc = _ref6[0],
              mouseEvents = _ref6[1],
              preventDefault = _ref6[2];

          // We're only keeping track of the first finger.
          // Should the user remove the finger that started the interaction, we use the next instead.
          // Note that this doesn't occur under normal circumstances,
          // and exists primarliy to ensure that the interaction continues without hiccups.
          // Note that the event listener is only passive when the `preventDefault` option is falsy.
          var touchmove$ = fromEvent(doc, "touchmove", { passive: !preventDefault }).pipe(map(function (e) {
            return Object.assign(e.touches[0], { event: e });
          }));

          // If mouse events aren't enabled, we're done here.
          if (!mouseEvents) return touchmove$;

          // Otherwise we listen for `mousemove` events,
          // but only those between a `start` and `end` event, i.e. while the user is sliding.
          // We unsubscribe form the source observable outside of those contraints.
          // Again, the listener is only marked as passive when the `preventDefault` option is falsy.
          var mousemove$ = fromEvent(doc, "mousemove", {
            passive: !preventDefault
          }).pipe(operators_subscribeWhen(merge(start$.pipe(mapTo(true)), end$.pipe(mapTo(false)))), map(function (event) {
            return Object.assign(event, { event: event });
          }));

          return merge(touchmove$, mousemove$);
        }));
      }

      // #### Get end observable
      // This function returns an observable of end events.
      // Usually, this is the `touchend` event of the last finger, but may also include `mouseup` events,
      // when the `mouseEvents` option is enabled.

    }, {
      key: "getEndObservable",
      value: function getEndObservable() {
        // Since the `mouseEvents` option may change at any point, we `switchMap` to reflect the changes.
        return combineLatest_combineLatest(this.subjects.document, this.subjects.mouseEvents).pipe(switchMap(function (_ref7) {
          var _ref8 = observables__slicedToArray(_ref7, 2),
              doc = _ref8[0],
              mouseEvents = _ref8[1];

          // We're only interested in the last `touchend`.
          // Otherwise there's at least one finger left on the screen,
          // that can be used to slide the drawer.
          var touchend$ = fromEvent(doc, "touchend", { passive: true }).pipe(filter(function (_ref9) {
            var touches = _ref9.touches;
            return touches.length === 0;
          }), map(function (event) {
            return event.changedTouches[0];
          }));

          // If mouse events aren't enabled, we're done here.
          if (!mouseEvents) return touchend$;

          // Otherwise we include `mouseup` events.
          var mouseup$ = fromEvent(doc, "mouseup", { passive: true });
          return merge(touchend$, mouseup$);
        }));
      }

      // #### Get "Is sliding?" observable
      // An observable that emits `true` when the user is *sliding* the drawer,
      // (i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
      // (i.e. moving the finger along the y-axis).

    }, {
      key: "getIsSlidingObservable",
      value: function getIsSlidingObservable(move$, start$, end$) {
        return this.getIsSlidingObservable2(move$, start$).pipe(take(1), startWith(undefined), repeatWhen(function () {
          return end$;
        }));
      }
    }, {
      key: "getIsSlidingObservable2",
      value: function getIsSlidingObservable2(move$, start$) {
        var _this2 = this;

        // If the threshold options is set, we delay the decision until
        // the finger has moved at least `threshold` pixels in either direction.
        if (this.threshold) {
          return move$.pipe(withLatestFrom(start$), skipWhile(function (_ref10) {
            var _ref11 = observables__slicedToArray(_ref10, 2),
                _ref11$ = _ref11[0],
                clientX = _ref11$.clientX,
                clientY = _ref11$.clientY,
                _ref11$2 = _ref11[1],
                startX = _ref11$2.clientX,
                startY = _ref11$2.clientY;

            return abs(startY - clientY) < _this2.threshold && abs(startX - clientX) < _this2.threshold;
          }), map(function (_ref12) {
            var _ref13 = observables__slicedToArray(_ref12, 2),
                _ref13$ = _ref13[0],
                clientX = _ref13$.clientX,
                clientY = _ref13$.clientY,
                _ref13$2 = _ref13[1],
                startX = _ref13$2.clientX,
                startY = _ref13$2.clientY;

            return abs(startX - clientX) >= abs(startY - clientY);
          }));

          // If the threshold option is set to `0` (or `false`) we make a decision immediately.
          // This is intended for Safari and possibly other browsers that have a built-in threshold.
          // Additionally, Safari ignores all calls to `preventDefault`, except on the first move event
          // after a start event, so that we *have to* make a decision immediately.
        } else {
          return move$.pipe(withLatestFrom(start$), map(function (_ref14) {
            var _ref15 = observables__slicedToArray(_ref14, 2),
                _ref15$ = _ref15[0],
                clientX = _ref15$.clientX,
                clientY = _ref15$.clientY,
                event = _ref15$.event,
                _ref15$2 = _ref15[1],
                startX = _ref15$2.clientX,
                startY = _ref15$2.clientY;

            var isSliding = abs(startX - clientX) >= abs(startY - clientY);
            if (_this2.preventDefault && isSliding) event.preventDefault();
            return isSliding;
          }));
        }
      }
    }]);

    return _class;
  }(C);
};
// CONCATENATED MODULE: ./src/mixin/setup.js
var setup__slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var setup__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function setup__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function setup__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function setup__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// # src / mixin / setup.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

// As mentioned before, we only import the RxJS function that we need.


































// ### Setup observables
// This function sets up the observable "pipeline".
var setup_setupObservablesMixin = function setupObservablesMixin(C) {
  return function (_baseObservablesMixin) {
    setup__inherits(_class, _baseObservablesMixin);

    function _class() {
      setup__classCallCheck(this, _class);

      return setup__possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    setup__createClass(_class, [{
      key: "setupObservables",
      value: function setupObservables() {
        var _this2 = this;

        // An observable of resize events.
        var resize$ = fromEvent(window, "resize", { passive: true }).pipe(takeUntil(this.subjects.disconnect), share(), startWith({}));

        // Keep measurements up-to-date.
        // Note that we need to temporarily remove the opened class to get the correct measures.
        resize$.pipe(takeUntil(this.subjects.disconnect)).subscribe(function () {
          if (_this2.opened) _this2.contentEl.classList.remove("hy-drawer-opened");
          _this2.drawerWidth = _this2.calcMovableDrawerWidth();
          if (_this2.opened) _this2.contentEl.classList.add("hy-drawer-opened");
        });

        // Emitts a value every time you change the `persistent` property of the drawer.
        // Interally, we invert it and call it `active`.
        var active$ = this.subjects.persistent.pipe(map(function (x) {
          return !x;
        }));

        // #### Start observable
        // Emits a value every time a start event *could* intiate an interaction.
        // Each emitted value is a hash containing a `clientX` and `clientY` key.
        var start$ = this.getStartObservable().pipe(takeUntil(this.subjects.disconnect), operators_filterWhen(active$), share());

        // An observable that emits `true`, as long as the drawer isn't fully closed
        // (as long as the scrim is visible the user can still "catch" the drawer).
        // It references the yet-to-be-defined `translateX` obsevable, so we wrap it inside a `defer`.
        var isScrimVisible$ = defer(function () {
          return _this2.translateX$.pipe(map(function (translateX) {
            return _this2.align === "left" ? translateX > 0 : translateX < _this2.drawerWidth;
          }));
        });

        // TODO: ...
        var isInRange$ = start$.pipe(withLatestFrom(isScrimVisible$), map(function (_ref) {
          var _ref2 = setup__slicedToArray(_ref, 2),
              clientX = _ref2[0].clientX,
              isScrimVisible = _ref2[1];

          return _this2.calcIsInRange(clientX, isScrimVisible);
        }), tap(function (inRange) {
          if (inRange) {
            if (_this2.mouseEvents) _this2.contentEl.classList.add("hy-drawer-grabbing");
            _this2.prepareInteraction();
          }
        }), share());

        // #### End observable
        // The observable of all relevant "end" events, i.e. the last `touchend` (or `mouseup`),
        var end$ = this.getEndObservable().pipe(takeUntil(this.subjects.disconnect), operators_filterWhen(active$, isInRange$), share());

        // #### Move observable
        // The observable of all relevant "move" events.
        var move$ = this.getMoveObservable(start$, end$).pipe(takeUntil(this.subjects.disconnect), operators_filterWhen(active$, isInRange$), share());

        // #### 'Is sliding?' observable
        // An observable that emits `true` when the user is *sliding* the drawer,
        // (i.e. moving the finger along the x-axis), or `false` when *scrolling* the page
        // (i.e. moving the finger along the y-axis), and `undefined` while we aren't sure yet.
        //
        // See [`getIsSlidingObservable`](./observables.md#get-is-sliding-observable).
        var isSliding$ = this.getIsSlidingObservable(move$, start$, end$).pipe(tap(function (isSliding) {
          if (isSliding) _this2.fireEvent("slidestart", { detail: _this2.opened });
        }));

        // #### Translate X observable
        // The `translateX` observable is the central observable of this component.
        // It emits the current x-coordinate of the drawer, which
        // can be modified by either of 3 incoming observables:
        //
        // 1. the animation/tween observable, and
        // 2. The move observable (the user's finger/mouse moving across the screen),
        // 3. direct modifications of the `opened` state.
        //
        // It is wrapped in a `defer` because it depends on previous values of itself.
        this.translateX$ = defer(function () {
          return merge(
          // 1)
          // The tween observable can be used unmodified (see below),
          // but isn't defined yet, because it depends on previous values of `translateX$`.
          _this2.tween$,

          // 2)
          // We only let move events modify the drawer's position when we are sure
          // that the user is sliding. In case the `preventDefault` option is enabled,
          // this is also when we're sure to call `preventDefault`.
          move$.pipe(operators_filterWhen(isSliding$), tap(function (_ref3) {
            var event = _ref3.event;

            if (_this2.preventDefault) event.preventDefault();
          }), observeOn(animationFrame),
          // Finally, we take the start position of the finger, the start position of the drawer,
          // and the current position of the finger to calculate the next `translateX` value.
          withLatestFrom(start$, _this2.startTranslateX$), map(function (_ref4) {
            var _ref5 = setup__slicedToArray(_ref4, 3),
                clientX = _ref5[0].clientX,
                startX = _ref5[1].clientX,
                startTranslateX = _ref5[2];

            return _this2.calcTranslateX(clientX, startX, startTranslateX);
          })),

          // 3)
          // When the `opened` state changes, we "jump" to the new position,
          // which is either 0 (when closed) or the width of the drawer (when open).
          combineLatest_combineLatest(_this2.subjects.opened, _this2.subjects.align).pipe(
          // Usually the cleanup code would run at the end of the fling animation,
          // but since there is no animation in this case, we call it directly.
          tap(function (_ref6) {
            var _ref7 = setup__slicedToArray(_ref6, 1),
                opened = _ref7[0];

            return _this2.cleanupInteraction(opened);
          }), map(function (_ref8) {
            var _ref9 = setup__slicedToArray(_ref8, 2),
                opened = _ref9[0],
                align = _ref9[1];

            return !opened ? 0 : _this2.drawerWidth * (align === "left" ? 1 : -1);
          })));
        })
        // `share`ing the observable between many subscribers:
        .pipe(takeUntil(this.subjects.disconnect), share());

        // The `translateX` value at the start of an interaction.
        // Typically this would be either 0 or `drawerWidth`, but since the user can initiate
        // an interaction *during the animation*, it could also be any value inbetween.
        // We obtain it by sampling the translate-x observable at the beginning of each interaction.
        this.startTranslateX$ = this.translateX$.pipe(sample(start$));

        // #### Tween observable
        // For the tween animations we first need an observable that tracks
        // the current velocity of the drawer,
        // which we will use to determine whether the drawer should flinging in its direction,
        // or snap back into place.
        var velocity$ = this.translateX$.pipe(timestamp(), pairwise(),
        // Since we are at the mercy of the browser firing move events,
        // we make sure that some time has passed since the last move event.
        filter(function (_ref10) {
          var _ref11 = setup__slicedToArray(_ref10, 2),
              prevTime = _ref11[0].timestamp,
              time = _ref11[1].timestamp;

          return time - prevTime > 0;
        }),
        // Now we are save to calculate the current velocity without divide by zero errors.
        map(function (_ref12) {
          var _ref13 = setup__slicedToArray(_ref12, 2),
              _ref13$ = _ref13[0],
              prevX = _ref13$.value,
              prevTime = _ref13$.timestamp,
              _ref13$2 = _ref13[1],
              x = _ref13$2.value,
              time = _ref13$2.timestamp;

          return (x - prevX) / (time - prevTime);
        }),
        // The initial velocity is zero.
        startWith(0));

        // TODO
        var willOpen$ = end$.pipe(tap(function () {
          return _this2.contentEl.classList.remove("hy-drawer-grabbing");
        }), withLatestFrom(start$, this.translateX$, velocity$), filter(this.calcIsSwipe.bind(this)), map(this.calcWillOpen.bind(this)),
        // TODO: only fire `slideend` event when slidestart fired as well?
        tap(function (willOpen) {
          return _this2.fireEvent("slideend", { detail: willOpen });
        }));

        // There are 2 things that can trigger an animation:
        // 1. The end of an interaction, i.e. the user releases the finger/mouse while moving the slider.
        // 2. A call to a method like `open` or `close` (represented by a value on the animate observable)
        //    Note that we call `prepareInteraction` manually here, because it wasn't triggered by a
        //    prior `touchdown`/`mousedown` event in this case.
        var tweenTrigger$ = merge(willOpen$, this.animateTo$.pipe(tap(this.prepareInteraction.bind(this))));

        // We silently set the new `opened` state here,
        // so that the next interaction will do the right thing even while the animation is
        // still playing, e.g. a call to `toggle` will cancel the current animation
        // and initiate an animation to the opposite state.
        this.tween$ = tweenTrigger$.pipe(tap(function (willOpen) {
          return _this2.setInternalState("opened", willOpen);
        }),
        // By using `switchMap` we ensure that subsequent events that trigger an animation
        // don't cause more than one animation to be played at a time.
        withLatestFrom(this.translateX$), switchMap(function (_ref14) {
          var _ref15 = setup__slicedToArray(_ref14, 2),
              opened = _ref15[0],
              translateX = _ref15[1];

          // We return a tween observable that runs cleanup code when it completes
          // --- unless a new interaction is initiated, in which case it is canceled.
          var inv = _this2.align === "left" ? 1 : -1;
          var endTranslateX = opened ? _this2.drawerWidth * inv : 0;
          var diffTranslateX = endTranslateX - translateX;
          var duration = BASE_DURATION + _this2.drawerWidth * WIDTH_CONTRIBUTION;

          return createTween(easeOutSine, translateX, diffTranslateX, duration).pipe(tap({ complete: function complete() {
              return _this2.subjects.opened.next(opened);
            } }), takeUntil(start$), takeUntil(_this2.subjects.align.pipe(skip(1))), share());
        }));

        // #### Subscriptions
        // Now we are ready to cause some side effects.
        //
        // The end result is always to update the (shadow) DOM, which happens here.
        // Note that the call to subscribe sets the whole process in motion,
        // and causes the code inside the above `defer` observables to run.
        requestIdleCallback(function () {
          _this2.translateX$.subscribe(_this2.updateDOM.bind(_this2));

          // A click on the scrim should close the drawer.
          fromEvent(_this2.scrimEl, "click").pipe(takeUntil(_this2.subjects.disconnect)).subscribe(function () {
            return _this2.close();
          });

          // Other than preventing sliding, setting `persistent` will also hide the scrim.
          active$.pipe(takeUntil(_this2.subjects.disconnect)).subscribe(function (active) {
            _this2.scrimEl.style.display = active ? "block" : "none";
          });

          // Whenever the alignment of the drawer changes, update the CSS classes.
          _this2.subjects.align.pipe(takeUntil(_this2.subjects.disconnect)).subscribe(function (align) {
            _this2.contentEl.classList.remove("hy-drawer-left");
            _this2.contentEl.classList.remove("hy-drawer-right");
            _this2.contentEl.classList.add("hy-drawer-" + align);
          });

          // If the experimental back button feature is enabled, handle popstate events...
          /*
          fromEvent(window, 'popstate')
            .pipe(
              takeUntil(this.subjects.disconnect),
              subscribeWhen(this.backButton$),
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
          _this2.subjects.mouseEvents.pipe(takeUntil(_this2.subjects.disconnect), switchMap(function (mouseEvents) {
            if (mouseEvents) _this2.contentEl.classList.add("hy-drawer-grab");else _this2.contentEl.classList.remove("hy-drawer-grab");

            return mouseEvents ? start$.pipe(withLatestFrom(isInRange$)) : never();
          })).subscribe(function (_ref16) {
            var _ref17 = setup__slicedToArray(_ref16, 2),
                event = _ref17[0].event,
                isInRange = _ref17[1];

            if (isInRange && event) event.preventDefault();
          });

          // Now we set the initial opend state.
          // If the experimental back button feature is enabled, we check the location hash...
          /*
          if (this._backButton) {
            const hash = `#${histId.call(this)}--opened`;
            if (window.location.hash === hash) this.setInternalState('opened', true);
          }
          */

          // Firing an event to let the outside world know the drawer is ready.
          _this2.fireEvent("init", { detail: _this2.opened });
        });
      }
    }]);

    return _class;
  }(observables_baseObservablesMixin(updateMixin(calc_calcMixin(C))));
};
// CONCATENATED MODULE: ./src/mixin/index.js
var mixin__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var mixin__get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function mixin__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function mixin__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function mixin__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mixin__toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// # src / mixin / index.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

// ## Overview
// This component is written in [RxJS] and reading its code requires some basic understanding
// of how RxJS works. It may also serve as an example of how to use RxJS.
//
// Other than RxJS, you should be familiar with [ES6 Mixin][esmixins],
// which is a clever way of using the ES6 class syntax to achieve inheritance-based mixins.
// The mixin in the main export of this file.

// ## Imports
// ES6+ functions that we use.
// import 'core-js/fn/array/from';
// import 'core-js/fn/function/bind';
// import 'core-js/fn/object/assign';

// Importing the hy-compontent base libary,
// which helps with making multiple versions of the component (Vanilla JS, WebComponent, etc...).






// TODO


// A set of [Modernizr] tests that are required for this component to work.
var MIXIN_FEATURE_TESTS = new _Set([].concat(mixin__toConsumableArray(COMPONENT_FEATURE_TESTS), ["eventlistener", "queryselector", "requestanimationframe", "classlist", "opacity", "csstransforms", "csspointerevents"]));



// ## Drawer Mixin
var mixin_drawerMixin = function drawerMixin(C) {
  return function (_setupObservablesMixi) {
    mixin__inherits(_class, _setupObservablesMixi);

    function _class() {
      mixin__classCallCheck(this, _class);

      return mixin__possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    mixin__createClass(_class, [{
      key: "setupComponent",


      // ### Setup
      // Overriding the setup function.
      value: function setupComponent(el, props) {
        mixin__get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "setupComponent", this).call(this, el, props);

        this.animateTo$ = new Subject_Subject();

        // Cache DOM elements.
        this.scrimEl = this.sroot.querySelector(".hy-drawer-scrim");
        this.contentEl = this.sroot.querySelector(".hy-drawer-content");

        // Set the initial alignment class.
        this.contentEl.classList.add("hy-drawer-" + this.align);
      }

      // Calling the [setup observables function](./setup.md) function.

    }, {
      key: "connectComponent",
      value: function connectComponent() {
        this.setupObservables();

        // TODO: meh..
        mixin__get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "connectComponent", this).call(this);
      }

      // ### Methods
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
      }

      // ### Options
      // The default values (and types) of the configuration options (required by hy-component)
      // See [Options](../../options.md) for usage information.

    }, {
      key: "types",
      get: function get() {
        return {
          opened: bool,
          align: oneOf(["left", "right"]),
          persistent: bool,
          range: array_of_arrayOf(number),
          threshold: number,
          preventDefault: bool,
          mouseEvents: bool
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
          mouseEvents: false
        };
      }
    }]);

    return _class;
  }(setup_setupObservablesMixin(rxjs_rxjsMixin(componentMixin(C))));
};

// [rxjs]: https://github.com/ReactiveX/rxjs
// [esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
// [modernizr]: https://modernizr.com/
// CONCATENATED MODULE: ./src/webcomponent/template.js
var template = "<div class=\"hy-drawer-scrim\"></div> <div class=\"hy-drawer-content\"> <slot></slot> </div> <style> @media screen { .hy-drawer-scrim { position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 20; opacity: 0; pointer-events: none; background: rgba(0, 0, 0, 0.5); transform: translateX(0); -webkit-tap-highlight-color: transparent; } .hy-drawer-content { position: fixed; top: 0; height: 100vh; z-index: 30; overflow-x: hidden; overflow-y: auto; transform: translateX(0); width: 300px; background: #e8e8e8; box-shadow: 0 0 15px rgba(0, 0, 0, 0.25); contain: strict; -webkit-overflow-scrolling: touch; } .hy-drawer-content.hy-drawer-left { left: -300px; } .hy-drawer-content.hy-drawer-right { right: -300px; } .hy-drawer-content.hy-drawer-left.hy-drawer-opened { left: 0 !important; transform: translateX(0) !important; } .hy-drawer-content.hy-drawer-right.hy-drawer-opened { right: 0 !important; transform: translateX(0) !important; } .hy-drawer-grab { cursor: move; cursor: -webkit-grab; cursor: -moz-grab; cursor: grab; } .hy-drawer-grabbing { cursor: -webkit-grabbing; cursor: -moz-grabbing; cursor: grabbing; } } @media print { .hy-drawer-scrim { display: none !important; } .hy-drawer-content { transform: none !important; } } @media screen { .hy-drawer-content { @apply --hy-drawer-content-container; width: var(--hy-drawer-width, 300px); background: var(--hy-drawer-background, #e8e8e8); box-shadow: var(--hy-drawer-box-shadow, 0 0 15px rgba(0, 0, 0, 0.25)); z-index: var(--hy-drawer-z-index, 30); } .hy-drawer-content.hy-drawer-left { left: calc( -1 * var(--hy-drawer-slide-width, var(--hy-drawer-width, 300px)) ); } .hy-drawer-content.hy-drawer-right { right: calc( -1 * var(--hy-drawer-slide-width, var(--hy-drawer-width, 300px)) ); } .hy-drawer-scrim { @apply --hy-drawer-scrim-container; background: var(--hy-drawer-scrim-background, rgba(0, 0, 0, 0.5)); z-index: var(--hy-drawer-scrim-z-index, 20); } } </style>";
// CONCATENATED MODULE: ./src/webcomponent/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEBCOMPONENT_FEATURE_TESTS", function() { return WEBCOMPONENT_FEATURE_TESTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HyDrawerElement", function() { return webcomponent_HyDrawerElement; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Set", function() { return _Set; });
var webcomponent__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function webcomponent__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function webcomponent__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function webcomponent__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function webcomponent__toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// # src / webcomponent / index.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

// import 'core-js/fn/array/from';

// We start by importing form the hy-component library...


// ...and our own component.


// Unlike the [HTML Import version](./html-import.md), this version bundles the template
// as a string.


// The set of Modernizr feature tests required for *this* version of the component.
var WEBCOMPONENT_FEATURE_TESTS = new _Set([].concat(webcomponent__toConsumableArray(CUSTOM_ELEMENT_FEATURE_TESTS), webcomponent__toConsumableArray(MIXIN_FEATURE_TESTS)));



// The exported class follows the HTML naming convetion.
// It is a combination of the `CustomElement` class (a wrapper around `HTMLElement` that
// doesn't break when piped through the babel transformer),
// our [`drawerMixin`](../mixin/index.md),
// and the `customElementMixin`, which is part of hy-component and handles things like
// reflecting options as HTML attributes, etc...
var webcomponent_HyDrawerElement = function (_customElementMixin) {
  webcomponent__inherits(HyDrawerElement, _customElementMixin);

  function HyDrawerElement() {
    webcomponent__classCallCheck(this, HyDrawerElement);

    return webcomponent__possibleConstructorReturn(this, (HyDrawerElement.__proto__ || Object.getPrototypeOf(HyDrawerElement)).apply(this, arguments));
  }

  webcomponent__createClass(HyDrawerElement, [{
    key: "getTemplate",


    // We override the `getTemplate` method and return a document fragment
    // obtained from parsing the template string.
    value: function getTemplate() {
      return fragmentFromString(template);
    }
  }], [{
    key: "observedAttributes",

    // The CustomElements spec demands that we provide a list of attributes (i.e. our options).
    get: function get() {
      return this.getObservedAttributes();
    }
  }]);

  return HyDrawerElement;
}(custom_element_customElementMixin(mixin_drawerMixin(CustomElement)));

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.dev.js.map