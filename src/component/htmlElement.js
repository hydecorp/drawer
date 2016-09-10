import kebabCase from 'kebab-case';

export default (SuperClass = HTMLElement) => class extends SuperClass {
  createdConnected() {
    this.initComponent(this, this.getPropsFromAttributes());
    this.reflectAttributeChanges();
  }

  getPropsFromAttributes() {
    const defaults = this.defaults();

    const props = {};
    for (const prop of Object.keys(defaults)) {
      const attrName = kebabCase(prop);
      const val = defaults[prop];

      if (val === true || val === false) {
        props[prop] = this.getAttribute(attrName) != null;
      } else {
        props[prop] = this.getAttribute(attrName);
      }
    }

    return props;
  }

  reflectAttributeChanges() {
    const defaults = this.defaults();

    for (const prop of Object.keys(defaults)) {
      const eventName = `${prop.toLowerCase()}change`;
      const attrName = kebabCase(prop);

      this.addEventListener(eventName, ({ detail }) => {
        if (detail === true) {
          this.setAttribute(attrName, '');
        } else if (detail === false) {
          this.removeAttribute(attrName);
        } else {
          this.setAttribute(attrName, detail);
        }
      });
    }
  }
};
