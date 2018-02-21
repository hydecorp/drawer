'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JQUERY_FEATURE_TESTS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('core-js/fn/array/from');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _defineJqueryComponent = require('hy-component/src/define-jquery-component');

var _symbols = require('hy-component/src/symbols');

var _qdSet = require('qd-set');

var _mixin = require('../mixin');

require('../style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // # src / jquery / index.js
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

// eslint-disable-line import/no-extraneous-dependencies

var JQUERY_FEATURE_TESTS = exports.JQUERY_FEATURE_TESTS = new _qdSet.Set([].concat(_toConsumableArray(_mixin.MIXIN_FEATURE_TESTS)));
JQUERY_FEATURE_TESTS.delete('customevent');

(0, _defineJqueryComponent.defineJQueryComponent)('hy.drawer', function (_drawerMixin) {
  _inherits(_class, _drawerMixin);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: _symbols.sSetupDOM,
    value: function value($el) {
      var children = $el.children().detach();

      $el.append((0, _jquery2.default)('<div class="hy-drawer-scrim" />')).append((0, _jquery2.default)('<div class="hy-drawer-content" />').append(children));

      return $el;
    }
  }]);

  return _class;
}((0, _mixin.drawerMixin)(_defineJqueryComponent.JQueryComponent)));