# webcomponent/index.js
Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


```js

import {
  customElementMixin,
  CustomElement,
  getTemplate,
  fragmentFromString,
  MODERNIZR_TESTS as CUSTOM_ELEMENT_MODERNIZER_TESTS,
} from 'y-component/src/custom-element';

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
```


