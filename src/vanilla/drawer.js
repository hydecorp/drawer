/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
import drawerCore from '../core/drawer';

export default class Drawer extends drawerCore() {
  constructor(el, props) {
    super();
    this.initComponent(el, props);
  }

  // @override
  setupDOM(el) {
    const layout = document.createElement('div');
    layout.classList.add('y-layout');

    const backdrop = document.createElement('div');
    backdrop.classList.add('y-backdrop');

    const drawer = document.createElement('div');
    drawer.classList.add('y-drawer');
    while (el.children.length > 0) {
      drawer.appendChild(el.children[0]);
    }

    layout.appendChild(backdrop);
    layout.appendChild(drawer);

    el.appendChild(layout);

    return el;
  }
}
