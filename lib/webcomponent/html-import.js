'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _customElement = require('hy-component/src/custom-element');

var _mixin = require('../mixin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // # src / webcomponent / html-import.js
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
// This in the HTML import version of the WebComponent version of this component.
// See [here](index.md) for the standalone version.
// This file is included via `script` tag in `hy-drawer.html` and shouldn't be used via ES import.

// First we check if CustomElements are supported.
if ('customElements' in window) {
  // When they are, we define an ad-hoc component class.
  // It is a combination of the `CustomElement` class (a wrapper around `HTMLElement` that
  // doesn't break when piped through the babel transformer),
  // our [`drawerMixin`](../mixin/index.md),
  // and the `customElementMixin`, which is part of hy-component and handles things like
  // reflecting options as HTML attributes, and looking up the `template`, etc..
  customElements.define('hy-drawer', function (_customElementMixin) {
    _inherits(_class, _customElementMixin);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, null, [{
      key: 'observedAttributes',

      // The CustomElements spec demands that we provide a list of attributes (i.e. our options).
      // hy-component provides these for us.
      get: function get() {
        return this.getObservedAttributes();
      }
    }]);

    return _class;
  }((0, _customElement.customElementMixin)((0, _mixin.drawerMixin)(_customElement.CustomElement))));

  // Otherwise we log to the console (during development).
} else if (process.env.DEBUG) {
  console.warn('Couldn\'t register hy-drawer component. Did you forget to include a WebComponents polyfill?');
}