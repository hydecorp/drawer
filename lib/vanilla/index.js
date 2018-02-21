'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drawer = exports.VANILLA_FEATURE_TESTS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('core-js/fn/array/from');

var _vanilla = require('hy-component/src/vanilla');

var _symbols = require('hy-component/src/symbols');

var _library = require('create-element-extended/library');

var _mixin = require('../mixin');

require('../style.css');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // # src / vanilla / index.js
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

var VANILLA_FEATURE_TESTS = exports.VANILLA_FEATURE_TESTS = _mixin.MIXIN_FEATURE_TESTS;

var Drawer = exports.Drawer = function (_drawerMixin) {
  _inherits(Drawer, _drawerMixin);

  function Drawer() {
    _classCallCheck(this, Drawer);

    return _possibleConstructorReturn(this, (Drawer.__proto__ || Object.getPrototypeOf(Drawer)).apply(this, arguments));
  }

  _createClass(Drawer, [{
    key: _symbols.sSetupDOM,
    value: function value(el) {
      if (!el) throw Error('No element provided');

      var df = new DocumentFragment();
      df.appendChild((0, _library.createElement)('div', { class: 'hy-drawer-scrim' }));
      df.appendChild((0, _library.createElement)('div', { class: 'hy-drawer-content' }, el.children));

      el.appendChild(df);

      return el;
    }
  }]);

  return Drawer;
}((0, _mixin.drawerMixin)(_vanilla.VanillaComponent));