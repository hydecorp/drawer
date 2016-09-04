'use strict';

/**
 * Copyright (c) 2016 Florian Klampfer
 * Released under MIT license
 */
function ySidebar(el) {
  var layout = document.createElement('div');
  layout.classList.add('y-layout');

  var backdrop = document.createElement('div');
  backdrop.classList.add('y-backdrop');

  var sidebar = document.createElement('div');
  sidebar.classList.add('y-sidebar');
  while (el.children.length > 0) {
    sidebar.appendChild(el.children[0]);
  }

  layout.appendChild(backdrop);
  layout.appendChild(sidebar);

  el.appendChild(layout);

  return new Sidebar(el);
}