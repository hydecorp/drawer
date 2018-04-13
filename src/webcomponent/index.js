// # src / webcomponent / index.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
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

// import 'core-js/fn/array/from';

// We start by importing form the hy-component library...
import {
  customElementMixin,
  CustomElement,
  fragmentFromString,
  CUSTOM_ELEMENT_FEATURE_TESTS,
  Set,
} from "hy-component/src/custom-element";

// ...and our own component.
import { drawerMixin, MIXIN_FEATURE_TESTS } from "../mixin";

// Unlike the [HTML Import version](./html-import.md), this version bundles the template
// as a string.
import { template } from "./template";

// The set of Modernizr feature tests required for *this* version of the component.
export const WEBCOMPONENT_FEATURE_TESTS = new Set([
  ...CUSTOM_ELEMENT_FEATURE_TESTS,
  ...MIXIN_FEATURE_TESTS,
]);

export { Set };

// The exported class follows the HTML naming convetion.
// It is a combination of the `CustomElement` class (a wrapper around `HTMLElement` that
// doesn't break when piped through the babel transformer),
// our [`drawerMixin`](../mixin/index.md),
// and the `customElementMixin`, which is part of hy-component and handles things like
// reflecting options as HTML attributes, etc...
export class HyDrawerElement extends customElementMixin(drawerMixin(CustomElement)) {
  // The CustomElements spec demands that we provide a list of attributes (i.e. our options).
  static get observedAttributes() {
    return this.getObservedAttributes();
  }

  // We override the `getTemplate` method and return a document fragment
  // obtained from parsing the template string.
  getTemplate() {
    return fragmentFromString(template);
  }
}
