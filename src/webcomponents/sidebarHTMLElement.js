import htmlElement from '../component/htmlElement';

import sidebarCore from '../core/sidebar';

export default class SidebarHTMLElement extends htmlElement(sidebarCore(HTMLElement)) {
  // TODO: "automate"
  attributeChangedCallback(attr, _, val) {
    switch (attr) {
      case 'menu-open': {
        if (val != null) {
          this.open();
        } else {
          this.close();
        }
        break;
      }

      case 'disabled': {
        if (val != null) {
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

  getTemplateInstance(filename) {
    // TODO: better why to get template?
    return document
      .querySelector(`link[href$="${filename}.html"]`)
      .import
      .getElementById('y-sidebar-template')
      .content
      .cloneNode(true);
  }
}
