import SidebarCore from '../core/sidebar';
import SidebarHTMLElement from '../webcomponents';

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

document.registerElement('y-sidebar-v0', class extends SidebarHTMLElement {
  createdCallback() {
    this.sidebar = new SidebarV0(this);
    this.reflectAttributeChanges();
  }
});
