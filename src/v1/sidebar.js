import htmlElement from '../component/htmlElement';

import sidebarCore from '../core/sidebar';

customElements.define('y-sidebar', class extends sidebarCore(htmlElement(HTMLElement)) {
  connectedCallback() {
    this.createdConnected();
  }

  // @override
  setupDOM(el) {
    el.attachShadow({ mode: 'open' });
    const instance = this.getTemplateInstance('v1/sidebar');
    el.shadowRoot.appendChild(instance);
    return el.shadowRoot;
  }

  getTemplateInstance() {
    // TODO: better why to get template?
    return document
      .querySelector('link[href$="v1/sidebar.html"]')
      .import
      .getElementById('y-sidebar-template')
      .content
      .cloneNode(true);
  }
});
