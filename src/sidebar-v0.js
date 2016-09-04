/**
 * Copyright (c) 2016 Florian Klampfer
 * Released under MIT license
 */
import SidebarCore from './sidebar-core';

export default class SidebarV0 extends SidebarCore {
  setupDOM(el) {
    const shadowRoot = el.createShadowRoot();

    // TODO: better why to get template?
    const instance = document
      .querySelector('link[href$="sidebar-v0.html"]')
      .import
      .getElementById('x-sidebar-template')
      .content
      .cloneNode(true);

    shadowRoot.appendChild(instance);

    this.el = shadowRoot;
    // super(shadowRoot);
  }
}

document.registerElement('y-sidebar', class extends HTMLElement {
  createdCallback() {
    this.sidebar = new SidebarV0(this);
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
