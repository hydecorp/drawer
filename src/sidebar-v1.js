/**
 * Copyright (c) 2016 Florian Klampfer
 * Released under MIT license
 */
import SidebarCore from './sidebar-core';

export default class SidebarV1 extends SidebarCore {
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });

    // TODO: better why to get template?
    const instance = document
      .querySelector('link[href$="sidebar-v1.html"]')
      .import
      .getElementById('y-sidebar-template')
      .content
      .cloneNode(true);

    el.shadowRoot.appendChild(instance);

    this.el = el.shadowRoot;
    // super(el.shadowRoot);
  }
}

window.customElements.define('y-sidebar-v1', class extends HTMLElement {
  connectedCallback() {
    this.sidebar = new SidebarV1(this);
  }

  // attributeChangedCallback(attrName, oldVal, newVal) {
  //   // TODO
  // }

  open(opts) {
    this.sidebar.open(opts);
  }

  close(opts) {
    this.sidebar.close(opts);
  }

  toggle(opts) {
    this.sidebar.toggle(opts);
  }
});
