# src / webcomponent / index.js
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

## Overview
This is the standalone version of the WebComponent version of hy-drawer.
It is inteded to be used with custom bundler toolchains.
It exports a HTML element that you can `define` as a custom element, e.g.
`customElements.define('hy-drawer', HTMLDrawerElement)`.

We start by importing form the hy-component library...


```js
import { customElementMixin, CustomElement, fragmentFromString, CUSTOM_ELEMENT_FEATURE_TESTS }
  from 'hy-component/src/custom-element';
import { sGetTemplate } from 'hy-component/src/symbols';
```

...and our own component.


```js
import { drawerMixin, MIXIN_FEATURE_TESTS } from '../mixin';
```

Unlike the [HTML Import version](./html-import.md), this version bundles the template
as a string.
Note that for this to work, your bundler needs to be able to bundle raw strings!


```js
import templateString from './template.html';
```

The set of Modernizr feature tests required for *this* version of the component.


```js
export const WEBCOMPONENT_FEATURE_TESTS = [
  ...CUSTOM_ELEMENT_FEATURE_TESTS,
  ...MIXIN_FEATURE_TESTS,
];
```

The exported class follows the HTML naming convetion.
It is a combination of the `CustomElement` class (a wrapper around `HTMLElement` that
doesn't break when piped through the babel transformer),
our [`drawerMixin`](../mixin/index.md),
and the `customElementMixin`, which is part of hy-component and handles things like
reflecting options as HTML attributes, etc...


```js
export class HTMLDrawerElement extends customElementMixin(drawerMixin(CustomElement)) {
```

The CustomElements spec demands that we provide a list of attributes (i.e. our options).
hy-component provides these for us.


```js
  static get observedAttributes() { return this.getObservedAttributes(); }
```

We override the `getTemplate` method and return a document fragment
obtained from parsing the template string.


```js
  [sGetTemplate]() { return fragmentFromString(templateString); }
}
```


