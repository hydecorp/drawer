/**
 * Copyright (c) 2016 Florian Klampfer
 * Released under MIT license
 */
class YSidebar extends HTMLElement {
  connectedCallback() {
    this.setupShadowDOM();
    this.sidebar = new Sidebar(this.shadowRoot);
  }

  setupShadowDOM() {
    this.attachShadow({ mode: 'open' });

    // TODO: better why to get template?
    const instance = document
      .querySelector('link[href$="sidebar.html"]')
      .import
      .getElementById('x-sidebar-template')
      .content
      .cloneNode(true);

    this.shadowRoot.appendChild(instance);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // TODO
  }

  open(opts) {
    this.sidebar.open(opts);
  }

  close(opts) {
    this.sidebar.close(opts);
  }

  toggle(opts) {
    this.sidebar.toggle(opts);
  }
}

window.customElements.define('y-sidebar', YSidebar);
