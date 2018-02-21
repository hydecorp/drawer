'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLDrawerElement = exports.WEBCOMPONENT_FEATURE_TESTS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('core-js/fn/array/from');

var _customElement = require('hy-component/src/custom-element');

var _symbols = require('hy-component/src/symbols');

var _qdSet = require('qd-set');

var _mixin = require('../mixin');

var _template = require('./template.html');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // # src / webcomponent / index.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
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
// This is the standalone version of the WebComponent version of hy-drawer.
// It is inteded to be used with custom bundler toolchains.
// It exports a HTML element that you can `define` as a custom element, e.g.
// `customElements.define('hy-drawer', HTMLDrawerElement)`.

// We start by importing form the hy-component library...


// ...and our own component.


// Unlike the [HTML Import version](./html-import.md), this version bundles the template
// as a string.
// Note that for this to work, your bundler needs to be able to bundle raw strings!


// The set of Modernizr feature tests required for *this* version of the component.
var WEBCOMPONENT_FEATURE_TESTS = exports.WEBCOMPONENT_FEATURE_TESTS = new _qdSet.Set([].concat(_toConsumableArray(_customElement.CUSTOM_ELEMENT_FEATURE_TESTS), _toConsumableArray(_mixin.MIXIN_FEATURE_TESTS)));

// The exported class follows the HTML naming convetion.
// It is a combination of the `CustomElement` class (a wrapper around `HTMLElement` that
// doesn't break when piped through the babel transformer),
// our [`drawerMixin`](../mixin/index.md),
// and the `customElementMixin`, which is part of hy-component and handles things like
// reflecting options as HTML attributes, etc...

var HTMLDrawerElement = exports.HTMLDrawerElement = function (_customElementMixin) {
  _inherits(HTMLDrawerElement, _customElementMixin);

  function HTMLDrawerElement() {
    _classCallCheck(this, HTMLDrawerElement);

    return _possibleConstructorReturn(this, (HTMLDrawerElement.__proto__ || Object.getPrototypeOf(HTMLDrawerElement)).apply(this, arguments));
  }

  _createClass(HTMLDrawerElement, [{
    key: _symbols.sGetTemplate,


    // We override the `getTemplate` method and return a document fragment
    // obtained from parsing the template string.
    value: function value() {
      return (0, _customElement.fragmentFromString)(_template2.default);
    }
  }], [{
    key: 'observedAttributes',

    // The CustomElements spec demands that we provide a list of attributes (i.e. our options).
    // hy-component provides these for us.
    get: function get() {
      return this.getObservedAttributes();
    }
  }]);

  return HTMLDrawerElement;
}((0, _customElement.customElementMixin)((0, _mixin.drawerMixin)(_customElement.CustomElement)));