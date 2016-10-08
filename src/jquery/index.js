/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import defineJQueryComponent from 'y-component/src/define-jquery-component';

import drawerCore from '../core';

defineJQueryComponent('y-drawer', class extends drawerCore() {
  constructor(el, props) {
    super();
    this.setupComponent(el, props);
  }

  // @override
  setupDOM(el) {
    const $el = $(el);

    const children = $el.children().detach();

    $el
      .append($('<div class="y-drawer-scrim" />'))
      .append($('<div class="y-drawer-content" />').append(children));

    return el;
  }
});
