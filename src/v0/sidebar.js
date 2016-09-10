import sidebarHTMLElement from '../webcomponents/sidebarHTMLElement';

export default class SidebarV0 extends sidebarHTMLElement() {
  setupDOM(el) {
    const shadowRoot = el.createShadowRoot();
    const instance = this.getTemplateInstance('v0/sidebar');
    shadowRoot.appendChild(instance);
    return shadowRoot;
  }

  createdCallback() {
    this.createdConnected();
  }
}

document.registerElement('y-sidebar-v0', SidebarV0);
