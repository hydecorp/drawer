import SidebarCore from '../core/sidebar';
import SidebarHTMLElement from '../webcomponents';

export default class SidebarV1 extends SidebarCore {
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });
    const instance = SidebarHTMLElement.getTemplateInstance('v1');
    el.shadowRoot.appendChild(instance);
    return el.shadowRoot;
  }
}

customElements.define('y-sidebar-v1', class extends SidebarHTMLElement {
  connectedCallback() {
    this.createdConnected(SidebarV1);
  }
});
