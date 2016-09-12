const propsSymbol = 'props';

function propSetter(prop, newVal) {
  const oldVal = this[propsSymbol][prop];
  this[propsSymbol][prop] = newVal;

  if (newVal !== oldVal) {
    this.el.dispatchEvent(new CustomEvent(`${prop.toLowerCase()}change`, {
      detail: newVal,
    }));
  }
}

function propGetter(prop) {
  return this[propsSymbol][prop];
}

class Mix {}

export default (SuperClass = Mix) => class extends SuperClass {
  initComponent(el, props) {
    this[propsSymbol] = Object.assign({}, this.defaults(), props);

    for (const prop of Object.keys(this[propsSymbol])) {
      Object.defineProperty(this, prop, {
        get: propGetter.bind(this, prop),
        set: propSetter.bind(this, prop),
      });
    }

    this.el = this.setupDOM(el);
  }

  setupDOM(el) {
    console.warn('setupDOM not implemented'); // eslint-disable-line no-console
    return el;
  }

  defaults() {
    console.warn('defaults not provided'); // eslint-disable-line no-console
    return {};
  }
};
