/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
import htmlElement from 'vanilla-component/src/htmlElement';

import drawerCore from '../core/drawer';

customElements.define('y-drawer', class extends drawerCore(htmlElement(HTMLElement)) {
  connectedCallback() {
    this.createdConnected();
  }

  // @override
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });
    const instance = this.getTemplateInstance('v1/drawer');
    el.shadowRoot.appendChild(instance);
    return el.shadowRoot;
  }

  getTemplateInstance() {
    // TODO: better why to get template?
    return document
      .querySelector('link[href$="v1/drawer.html"]')
      .import
      .getElementById('y-drawer-template')
      .content
      .cloneNode(true);
  }
});
