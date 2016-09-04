'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Copyright (c) 2016 Florian Klampfer
 * Released under MIT license
 */
var YSidebar = function (_HTMLElement) {
  _inherits(YSidebar, _HTMLElement);

  function YSidebar() {
    _classCallCheck(this, YSidebar);

    return _possibleConstructorReturn(this, (YSidebar.__proto__ || Object.getPrototypeOf(YSidebar)).apply(this, arguments));
  }

  _createClass(YSidebar, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      this.setupShadowDOM();
      this.sidebar = new Sidebar(this.shadowRoot);
    }
  }, {
    key: 'setupShadowDOM',
    value: function setupShadowDOM() {
      this.attachShadow({ mode: 'open' });

      // TODO: better why to get template?
      var instance = document.querySelector('link[href$="sidebar.html"]').import.getElementById('x-sidebar-template').content.cloneNode(true);

      this.shadowRoot.appendChild(instance);
    }
  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(attrName, oldVal, newVal) {
      // TODO
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

  return YSidebar;
}(HTMLElement);

window.customElements.define('y-sidebar', YSidebar);