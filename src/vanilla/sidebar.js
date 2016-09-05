import SidebarCore from '../core/sidebar';

export default class Sidebar extends SidebarCore {
  setupDOM(el) {
    const layout = document.createElement('div');
    layout.classList.add('y-layout');

    const backdrop = document.createElement('div');
    backdrop.classList.add('y-backdrop');

    const sidebar = document.createElement('div');
    sidebar.classList.add('y-sidebar');
    while (el.children.length > 0) {
      sidebar.appendChild(el.children[0]);
    }

    layout.appendChild(backdrop);
    layout.appendChild(sidebar);

    el.appendChild(layout);

    this.el = el;
    // super(el);
  }
}
