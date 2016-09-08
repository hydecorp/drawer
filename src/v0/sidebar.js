import SidebarCore from '../core/sidebar';
import SidebarHTMLElement from '../webcomponents';

export default class SidebarV0 extends SidebarCore {
  setupDOM(el) {
    const shadowRoot = el.createShadowRoot();
    const instance = SidebarHTMLElement.getTemplateInstance('v0');
    shadowRoot.appendChild(instance);
    return shadowRoot;
  }
}

document.registerElement('y-sidebar-v0', class extends SidebarHTMLElement {
  createdCallback() {
    this.createdConnected(SidebarV0);
  }
});
