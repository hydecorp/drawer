/* eslint-disable func-names, no-param-reassign */

export default ($, name, Component) => {
  function plugin(option, ...args) {
    return this.each(function () { // Not using => on purpose!
      const $this = $(this);
      const data = $this.data(name);
      const props = $.extend({}, $this.data(), typeof option === 'object' && option);
      const action = typeof option === 'string' ? option : null;

      if (!data) $this.data(name, new Component(this, props));
      else if (action) data[action](...args);
    });
  }

  const old = $.fn[name];

  $.fn[name] = plugin;
  $.fn[name].Constructor = Component;

  $.fn[name].noConflict = function () { // Not using => on purpose!
    $.fn[name] = old;
    return this;
  };
};
