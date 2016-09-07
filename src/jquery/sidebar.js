/* eslint func-names: ["error", "never"] */

import SidebarCore from '../core/sidebar';

export default class SidebarJQuery extends SidebarCore {
  setupDOM(el) {
    const $el = $(el);

    $('<div class="y-layout"/>')
      .append($('<div class="y-backdrop"/>'))
      .append($('<div class="y-sidebar"/>').append($el.children().detach()))
      .appendTo($el);

    return el;
  }
}

function plugin(option, ...args) {
  return this.each(function () {
    const $this = $(this);
    const data = $this.data('y.sidebar');
    const options = $.extend(
      {},
      SidebarCore.DEFAULTS,
      $this.data(),
      typeof option === 'object' && option
    );
    const action = typeof option === 'string' ? option : null;

    if (!data) $this.data('y.sidebar', new SidebarJQuery(this, options));
    else if (action) data[action](...args);
  });
}

const old = $.fn.sidebar;

$.fn.sidebar = plugin;
$.fn.sidebar.Constructor = SidebarJQuery;

$.fn.sidebar.noConflict = function () {
  $.fn.sidebar = old;
  return this;
};
