// TODO: can these tasks be automated!?
export default class SidebarHTMLElement extends HTMLElement {
  createdConnected(Ctor) {
    this.sidebar = new Ctor(this, {
      menuOpen: this.getAttribute('menu-open') != null,
      disabled: this.getAttribute('disabled') != null,
    });

    this.reflectAttributeChanges();
  }

  reflectAttributeChanges() {
    this.addEventListener('menuopenchange', ({ detail }) => {
      if (detail) {
        this.setAttribute('menu-open', '');
      } else {
        this.removeAttribute('menu-open');
      }
    });

    this.addEventListener('disabledchange', ({ detail }) => {
      if (detail) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    });
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'menu-open': {
        if (newVal != null) {
          this.open();
        } else {
          this.close();
        }
        break;
      }

      case 'disabled': {
        if (newVal != null) {
          this.disable();
        } else {
          this.enable();
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

  disable() {
    this.sidebar.disable();
  }

  enable() {
    this.sidebar.enable();
  }
}

// TODO: better why to get template?
SidebarHTMLElement.getTemplateInstance = (version) =>
  document
    .querySelector(`link[href$="${version}/sidebar.html"]`)
    .import
    .getElementById('y-sidebar-template')
    .content
    .cloneNode(true);
