import SidebarHTMLElement from '../webcomponents/SidebarHTMLElement';

customElements.define('y-sidebar-v1', class extends SidebarHTMLElement {
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });
    const instance = this.getTemplateInstance('v1/sidebar');
    el.shadowRoot.appendChild(instance);
    return el.shadowRoot;
  }

  connectedCallback() {
    this.createdConnected();
  }
});
