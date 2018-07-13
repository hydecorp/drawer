# src / mixin / index.js
Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>

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
This component is written in [RxJS] and reading its code requires some basic understanding
of how RxJS works. It may also serve as an example of how to use RxJS.

Other than RxJS, you should be familiar with [ES6 Mixin][esmixins],
which is a clever way of using the ES6 class syntax to achieve inheritance-based mixins.
The mixin in the main export of this file.

## Imports
ES6+ functions that we use.
import 'core-js/fn/array/from';
import 'core-js/fn/function/bind';

Importing the hy-compontent base libary,
which helps with making multiple versions of the component (Vanilla JS, WebComponent, etc...).


```js
import { componentMixin, COMPONENT_FEATURE_TESTS, Set } from "hy-component/src/component";
import { rxjsMixin } from "hy-component/src/rxjs";
import { arrayOf, bool, number, oneOf } from "hy-component/src/types";

import { Subject } from "rxjs/_esm5";
```

TODO


```js
import { setupObservablesMixin } from "./setup";
```

A set of [Modernizr] tests that are required for this component to work.


```js
export const MIXIN_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
  "eventlistener",
  "queryselector",
  "requestanimationframe",
  "classlist",
  "opacity",
  "csstransforms",
  "csspointerevents",
]);

export { Set };
```

## Drawer Mixin


```js
export const drawerMixin = C =>
  class extends setupObservablesMixin(rxjsMixin(componentMixin(C))) {
```

The name of the component (required by hy-component)


```js
    static get componentName() {
      return "hy-drawer";
    }
```

### Options
The default values (and types) of the configuration options (required by hy-component)
See [Options](../../options.md) for usage information.


```js
    static get types() {
      return {
        opened: bool,
        align: oneOf(["left", "right"]),
        persistent: bool,
        range: arrayOf(number),
        threshold: number,
        preventDefault: bool,
        touchEvents: bool,
        mouseEvents: bool,
      };
    }

    static get defaults() {
      return {
        opened: false,
        align: "left",
        persistent: false,
        range: [0, 100],
        threshold: 10,
        preventDefault: false,
        touchEvents: false,
        mouseEvents: false,
      };
    }
```

### Setup
Overriding the setup function.


```js
    setupComponent(el, props) {
      super.setupComponent(el, props);

      this.animateTo$ = new Subject();
```

Cache DOM elements.


```js
      this.scrimEl = this.sroot.querySelector(".hy-drawer-scrim");
      this.contentEl = this.sroot.querySelector(".hy-drawer-content");
```

Set the initial alignment class.


```js
      this.contentEl.classList.add(`hy-drawer-${this.align}`);
    }
```

Calling the [setup observables function](./setup.md) function.


```js
    connectComponent() {
      this.setupObservables();
```

TODO: meh..


```js
      super.connectComponent();
    }
```

### Methods
Public methods of this component. See [Methods](../../methods.md) for more.


```js
    open(animated = true) {
      if (animated) this.animateTo$.next(true);
      else this.opened = true;
    }

    close(animated = true) {
      if (animated) this.animateTo$.next(false);
      else this.opened = false;
    }

    toggle(animated = true) {
      if (animated) this.animateTo$.next(!this.opened);
      else this.opened = !this.opened;
    }
  };
```

[rxjs]: https://github.com/ReactiveX/rxjs
[esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
[modernizr]: https://modernizr.com/


