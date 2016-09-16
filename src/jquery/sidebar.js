/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
/* eslint-disable no-unresolved */
import defineJQueryComponent from 'vanilla-component/src/defineJQueryComponent';

import sidebarCore from '../core/sidebar';

defineJQueryComponent($, 'sidebar', class extends sidebarCore() {
  constructor(el, props) {
    super();
    this.initComponent(el, props);
  }

  // @override
  setupDOM(el) {
    const $el = $(el);

    $('<div class="y-layout" />')
      .append($('<div class="y-backdrop" />'))
      .append($('<div class="y-sidebar" />').append($el.children().detach()))
      .appendTo($el);

    return el;
  }
});
