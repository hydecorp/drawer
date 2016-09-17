/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
import htmlElement from 'y-component/src/htmlElement';

import drawerCore from '../core';

customElements.define('y-drawer', class extends drawerCore(htmlElement(HTMLElement)) {
  connectedCallback() {
    this.createdConnected();
  }

  // @override
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });
    const instance = this.getTemplateInstance();
    el.shadowRoot.appendChild(instance);
    return el.shadowRoot;
  }

  getTemplateInstance() {
    // TODO: better why to get template?
    return document
      .querySelector('link[href$="v1/index.html"]')
      .import
      .getElementById('y-drawer-template')
      .content
      .cloneNode(true);
  }
});
