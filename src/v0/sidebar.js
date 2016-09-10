import SidebarHTMLElement from '../webcomponents/SidebarHTMLElement';

document.registerElement('y-sidebar-v0', class extends SidebarHTMLElement {
  setupDOM(el) {
    const shadowRoot = el.createShadowRoot();
    const instance = this.getTemplateInstance('v0/sidebar');
    shadowRoot.appendChild(instance);
    return shadowRoot;
  }

  createdCallback() {
    this.createdConnected();
  }
});
