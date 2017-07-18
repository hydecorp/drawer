// # webcomponent/html-import.js
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

import {
  customElementMixin,
  CustomElement,
  MODERNIZR_TESTS as CUSTOM_ELEMENT_MODERNIZER_TESTS,
} from 'y-component/src/custom-element';

import { drawerMixin, MODERNIZR_TESTS as DRAWER_MIXIN_MODERNIZR_TESTS } from '../mixin';

export const MODERNIZR_TESTS = [
  ...CUSTOM_ELEMENT_MODERNIZER_TESTS,
  ...DRAWER_MIXIN_MODERNIZR_TESTS,
  'htmlimports',
];

if ('customElements' in window) {
  customElements.define('y-drawer', class extends customElementMixin(drawerMixin(CustomElement)) {
    static get observedAttributes() { return this.getObservedAttributes(); }
  });
} else if (process.env.DEBUG) {
  console.warn('Couldn\'t define `y-drawer` component. Did you forget to include a custom elements polyfill?');
}
