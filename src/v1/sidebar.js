import SidebarCore from '../core/sidebar';
import SidebarHTMLElement from '../webcomponents';

export default class SidebarV1 extends SidebarCore {
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });

    // TODO: better why to get template?
    const instance = document
      .querySelector('link[href$="v1/sidebar.html"]')
      .import
      .getElementById('y-sidebar-template')
      .content
      .cloneNode(true);

    el.shadowRoot.appendChild(instance);

    return el.shadowRoot;
  }
}

customElements.define('y-sidebar-v1', class extends SidebarHTMLElement {
  connectedCallback() {
    this.sidebar = new SidebarV1(this);
    this.reflectAttributeChanges();
  }
});
