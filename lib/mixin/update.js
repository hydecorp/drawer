"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMixin = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
  return /*#__PURE__*/function (_C) {
    _inherits(_class, _C);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "histId",
      value: function histId() {
        return this.el.id || this.constructor.componentName;
      } // #### Prepare and cleanup interaction
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

        this.fireEvent("prepare");
      } // Cleanup code after a completed interaction.
      // Will add/remove the beforementioned `hy-drawer-opened` class.

    }, {
      key: "cleanupInteraction",
      value: function cleanupInteraction(opened) {
        if (hasCSSOM) {
          this.contentEl.attributeStyleMap["delete"]("will-change");
          this.scrimEl.attributeStyleMap["delete"]("will-change");

          if (opened) {
            this.scrimEl.attributeStyleMap.set("pointer-events", new CSSKeywordValue("all"));
          } else {
            this.scrimEl.attributeStyleMap["delete"]("pointer-events");
          }
        } else {
          this.scrimEl.style.willChange = "";
          this.contentEl.style.willChange = "";

          if (opened) {
            this.scrimEl.style.pointerEvents = "all";
          } else {
            this.scrimEl.style.pointerEvents = "";
          }
        } // If the xperimental back button feature is enabled we hack the history API,
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


        this.fireEvent("transitioned", {
          detail: opened
        });
      } // #### Update DOM
      // In the end, we only modify two properties: The x-coordinate of the drawer,
      // and the opacity of the scrim, which is handled by `updateDOM`.

    }, {
      key: "updateDOM",
      value: function updateDOM(translateX, drawerWidth) {
        this.translateX = translateX;
        var inv = this.align === "left" ? 1 : -1;
        var opacity = this.opacity = translateX / drawerWidth * inv;
        if (this.moveCallback) this.moveCallback({
          translateX: translateX,
          opacity: opacity
        });
        /* this.fireEvent("move", { detail: { translateX, opacity } }); */

        if (hasCSSOM) {
          this.contentEl.attributeStyleMap.set("transform", new CSSTransformValue([new CSSTranslate(CSS.px(translateX), CSS.px(0))]));
          this.scrimEl.attributeStyleMap.set("opacity", this.opacity);
        } else {
          this.contentEl.style.transform = "translateX(".concat(translateX, "px)");
          this.scrimEl.style.opacity = this.opacity;
        }
      }
    }]);

    return _class;
  }(C);
};

exports.updateMixin = updateMixin;