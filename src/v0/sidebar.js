import SidebarCore from '../core/sidebar';

export default class SidebarV0 extends SidebarCore {
  setupDOM(el) {
    const shadowRoot = el.createShadowRoot();

    // TODO: better why to get template?
    const instance = document
      .querySelector('link[href$="v0/sidebar.html"]')
      .import
      .getElementById('y-sidebar-template')
      .content
      .cloneNode(true);

    shadowRoot.appendChild(instance);

    return shadowRoot;
  }
}

function isTruthyAttrVal(v) {
  return v != null && v !== 'false' && v !== 'null' && v !== 'undefined';
}

document.registerElement('y-sidebar', class extends HTMLElement {
  createdCallback() {
    this.sidebar = new SidebarV0(this);

    for (const attr of this.attributes) {
      this.attributeChangedCallback(attr.name, undefined, attr.value);
    }
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'menu-open': {
        if (isTruthyAttrVal(newVal)) {
          this.open();
        } else {
          this.close();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  open(opts) {
    this.sidebar.open(opts);
  }

  close(opts) {
    this.sidebar.close(opts);
  }

  toggle(opts) {
    this.sidebar.toggle(opts);
  }
});
