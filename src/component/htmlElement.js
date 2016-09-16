import camelCase from 'camel-case';
import paramCase from 'param-case';

// infers primitive types form `defVal` and applies it to `val`
function simpleType(defVal, val) {
  if (typeof defVal === 'boolean') {
    return val != null;
  } else if (typeof defVal === 'number') {
    if (val != null) {
      return Number(val);
    }
    return defVal;
  } else if (typeof defVal === 'string') {
    if (val != null) {
      return val;
    }
    return defVal;
  }
  return null;
}

function setAttribute(key, value) {
  const attrName = paramCase(key);

  if (value === true) {
    this.setAttribute(attrName, '');
  } else if (value === false) {
    this.removeAttribute(attrName);
  } else {
    this.setAttribute(attrName, value);
  }
}

export default (C = HTMLElement) => class extends C {
  createdConnected() {
    this.initComponent(this, this.getStateFromAttributes());
    this.reflectAttributeChanges();
  }

  getStateFromAttributes() {
    const defaults = this.defaults();

    const state = {};

    for (const key of Object.keys(defaults)) {
      const attrName = paramCase(key);
      const attrVal = this.getAttribute(attrName);
      const typedValue = simpleType(defaults[key], attrVal);

      if (typedValue != null) {
        state[key] = typedValue;
      }
    }

    return state;
  }

  reflectAttributeChanges() {
    const defaults = this.defaults();

    for (const key of Object.keys(defaults)) {
      const eventName = `${key.toLowerCase()}change`;

      this.addEventListener(eventName, ({ detail }) => {
        setAttribute.call(this, key, detail);
      });

      setAttribute.call(this, key, this[key]);
    }
  }

  attributeChangedCallback(attr, oldVal, val) {
    const defaults = this.defaults();
    const key = camelCase(attr);
    const typedValue = simpleType(defaults[key], val);

    if (typedValue != null) {
      this[key] = typedValue;
    }
  }
};
