/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
import drawerCore from '../core';

export default class Drawer extends drawerCore() {
  constructor(el, props) {
    super();
    this.initComponent(el, props);
  }

  // @override
  setupDOM(el) {
    if (!el) throw Error('No element provided');

    const backdrop = document.createElement('div');
    backdrop.classList.add('y-backdrop');

    const drawer = document.createElement('div');
    drawer.classList.add('y-drawer');
    while (el.children.length > 0) {
      drawer.appendChild(el.children[0]);
    }

    el.appendChild(backdrop);
    el.appendChild(drawer);

    return el;
  }
}
