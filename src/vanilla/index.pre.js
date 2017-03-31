// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import drawerCore from '../core';

const style = `
<style>
<!-- @include ../drawer.css -->
</style>`;


function fragmentFromString(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}

export default class Drawer extends drawerCore() {
  constructor(el, props) {
    super();
    this.setupComponent(el, props);
  }

  // @override
  setupDOM(el) {
    if (!el) throw Error('No element provided');

    const scrim = document.createElement('div');
    scrim.classList.add('y-drawer-scrim');

    const content = document.createElement('div');
    content.classList.add('y-drawer-content');
    while (el.children.length > 0) {
      content.appendChild(el.children[0]);
    }

    el.appendChild(scrim);
    el.appendChild(content);

    const ref = document.getElementsByTagName('style')[0];
    ref.parentNode.insertBefore(fragmentFromString(style), ref);

    return el;
  }
}
