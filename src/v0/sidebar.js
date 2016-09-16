/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
/* eslint-disable no-unresolved */
import htmlElement from 'vanilla-component/src/htmlElement';

import sidebarCore from '../core/sidebar';

document.registerElement('y-sidebar', class extends sidebarCore(htmlElement(HTMLElement)) {
  createdCallback() {
    this.createdConnected();
  }

  // @override
  setupDOM(el) {
    const shadowRoot = el.createShadowRoot();
    const instance = this.getTemplateInstance();
    shadowRoot.appendChild(instance);
    return shadowRoot;
  }

  getTemplateInstance() {
    // TODO: better why to get template?
    return document
      .querySelector('link[href$="v0/sidebar.html"]')
      .import
      .getElementById('y-sidebar-template')
      .content
      .cloneNode(true);
  }
});
