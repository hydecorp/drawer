function isTruthyAttrVal(v) {
  return v != null &&
         v !== 'false' &&
         v !== 'null' &&
         v !== 'undefined' &&
         v !== '0';
}

// TODO: can these tasks be automated!?
export default class SidebarHTMLElement extends HTMLElement {
  reflectAttributeChanges() {
    this.addEventListener('menuopenchange', ({ detail }) => {
      // HACK: Since JS is single threaded, we can set the silent flag here to break the
      // event cicle. Not strictly speaking necessary, since it's also broken inside SidebarCore.
      this.silenthack = true;

      if (detail) {
        this.setAttribute('menu-open', 'menu-open');
      } else {
        this.removeAttribute('menu-open');
      }
    });
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // HACK: See above
    if (this.silenthack) {
      this.silenthack = false;
      return;
    }

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
}
