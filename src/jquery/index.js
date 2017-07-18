// # jquery/index.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import $ from 'jquery';

import { JQueryComponent, defineJQueryComponent, setupDOM }
from 'y-component/src/define-jquery-component';

import { drawerMixin, MODERNIZR_TESTS as DRAWER_MIXIN_MODERNIZER_TESTS } from '../mixin';
import '../style.css';

export const MODERNIZR_TESTS = [
  ...DRAWER_MIXIN_MODERNIZER_TESTS,
];

// TODO: rename? check how jQuery UI does it
export const drawerJQueryPlugin = defineJQueryComponent('drawer',
  class extends drawerMixin(JQueryComponent) {
    /* @override */
    [setupDOM](el) {
      const $el = $(el);

      const children = $el.children().detach();

      $el
        .append($('<div class="y-drawer-scrim" />'))
        .append($('<div class="y-drawer-content" />').append(children));

      return el;
    }
  },
);
