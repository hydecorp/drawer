/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
import defineJQueryComponent from 'y-component/src/defineJQueryComponent';

import drawerCore from '../core';

defineJQueryComponent($, 'drawer', class extends drawerCore() {
  constructor(el, props) {
    super();
    this.initComponent(el, props);
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
