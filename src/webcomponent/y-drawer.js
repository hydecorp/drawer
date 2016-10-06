/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import htmlElement from 'y-component/src/htmlElement';

import drawerCore from '../core';

function hasShadowDOMV0() {
  return 'createShadowRoot' in document.body;
}

function hasShadowDOMV1() {
  return 'attachShadow' in document.body;
}

export default class HTMLYDrawerElement extends htmlElement(drawerCore(HTMLElement)) {
  connectedCallback() {
    this.createdConnected();
  }

  createdCallback() {
    this.createdConnected();
  }

  getTemplateInstance(version) {
    const name = 'y-drawer';
    return document
        .querySelector(`link[href$="${name}.html"]`)
        .import
        .getElementById(`${name}-template-${version}`)
        .content
        .cloneNode(true);
  }

  // @override
  setupDOM(el) {
    if (hasShadowDOMV1()) {
      el.attachShadow({ mode: 'open' });
      const instance = this.getTemplateInstance('v1');
      el.shadowRoot.appendChild(instance);
      return el.shadowRoot;
    } else if (hasShadowDOMV0()) {
      const shadowRoot = el.createShadowRoot();
      const instance = this.getTemplateInstance('v0');
      shadowRoot.appendChild(instance);
      return shadowRoot;
    }
    throw Error('ShadowDOM API not supported (neither v0 nor v1)');
  }
}
