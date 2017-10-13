# src / webcomponent / html-import.js
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
This in the HTML import version of the WebComponent version of this component.
See [here](index.md) for the standalone version.
This file is included via `script` tag in `hy-drawer.html` and shouldn't be used via ES import.


```js

import { customElementMixin, CustomElement } from 'hy-component/src/custom-element';

import { drawerMixin } from '../mixin';
```

First we check if CustomElements are supported.


```js
if ('customElements' in window) {
```

When they are, we define an ad-hoc component class.
It is a combination of the `CustomElement` class (a wrapper around `HTMLElement` that
doesn't break when piped through the babel transformer),
our [`drawerMixin`](../mixin/index.md),
and the `customElementMixin`, which is part of hy-component and handles things like
reflecting options as HTML attributes, and looking up the `template`, etc..


```js
  customElements.define('hy-drawer', class extends customElementMixin(drawerMixin(CustomElement)) {
```

The CustomElements spec demands that we provide a list of attributes (i.e. our options).
hy-component provides these for us.


```js
    static get observedAttributes() { return this.getObservedAttributes(); }
  });
```

Otherwise we log to the console (during development).


```js
} else if (process.env.DEBUG) {
  console.warn('Couldn\'t define `hy-drawer` component. Did you forget to include a custom elements polyfill?');
}
```


