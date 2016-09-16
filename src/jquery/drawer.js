/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
import defineJQueryComponent from 'vanilla-component/src/defineJQueryComponent';

import drawerCore from '../core/drawer';

defineJQueryComponent($, 'drawer', class extends drawerCore() {
  constructor(el, props) {
    super();
    this.initComponent(el, props);
  }

  // @override
  setupDOM(el) {
    const $el = $(el);

    $('<div class="y-layout" />')
      .append($('<div class="y-backdrop" />'))
      .append($('<div class="y-drawer" />').append($el.children().detach()))
      .appendTo($el);

    return el;
  }
});
