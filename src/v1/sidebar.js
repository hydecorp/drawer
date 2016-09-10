import sidebarHTMLElement from '../webcomponents/sidebarHTMLElement';

export default class SidebarV1 extends sidebarHTMLElement() {
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });
    const instance = this.getTemplateInstance('v1/sidebar');
    el.shadowRoot.appendChild(instance);
    return el.shadowRoot;
  }

  connectedCallback() {
    this.createdConnected();
  }
}

customElements.define('y-sidebar-v1', SidebarV1);
