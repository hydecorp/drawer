import addJQueryComponent from '../component/addJQueryComponent';

import sidebarCore from '../core/sidebar';

export default class SidebarJQuery extends sidebarCore() {
  constructor(el, props) {
    super();
    this.initComponent(el, props);
  }

  setupDOM(el) {
    const $el = $(el);

    $('<div class="y-layout" />')
      .append($('<div class="y-backdrop" />'))
      .append($('<div class="y-sidebar" />').append($el.children().detach()))
      .appendTo($el);

    return el;
  }
}

addJQueryComponent($, 'sidebar', SidebarJQuery);
