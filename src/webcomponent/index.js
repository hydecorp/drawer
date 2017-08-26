// # webcomponent / index.js
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

// ## Overview
// This is the standalone version of the WebComponent version of **hy-drawer**.
// It exports the HTML element that you can define as a custom element, e.g.
// `customElements.define('hy-drawer', DrawerHTMLElement)`.
// Unlike the [HTML Import version](html-import.md), it bundles the template as a string.
// **NOTE**: For this to work, your bundler needs to be able to parse underscore `.ejs` templates!

import {
  customElementMixin,
  CustomElement,
  getTemplate,
  fragmentFromString,
  MODERNIZR_TESTS as CUSTOM_ELEMENT_MODERNIZER_TESTS,
} from 'hy-component/src/custom-element';

import { drawerMixin, MODERNIZR_TESTS as DRAWER_MIXIN_MODERNIZR_TESTS } from '../mixin';

import templateString from './template.ejs';

export const MODERNIZR_TESTS = [
  ...CUSTOM_ELEMENT_MODERNIZER_TESTS,
  ...DRAWER_MIXIN_MODERNIZR_TESTS,
];

export class DrawerHTMLElement extends customElementMixin(drawerMixin(CustomElement)) {
  static get observedAttributes() { return this.getObservedAttributes(); }

  /* @override */
  [getTemplate]() { return fragmentFromString(templateString); }
}
