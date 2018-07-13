# hy-drawer

[![npm version](https://badge.fury.io/js/hy-drawer.svg)](https://badge.fury.io/js/hy-drawer)

**hy-drawer** is a touch-enabled drawer component for the modern web. It focuses on providing a fun, natural feel in both the Android and iOS stock browser, while being performant and easy to use. It is the perfect companion for mobile-first web pages and progressive web apps.

> A touch-enabled drawer component for the modern web.
{:.lead}

**hy-drawer** is used by hundreds of sites as part of the [Hydejack]{:.external} Jekyll theme.

**NOTE**: The current version is still a pre-release. The public API may still change in important ways.
{:.message}

[hydejack]: https://hydejack.com/

<!--more-->

## Examples
When viewing this page on [webcomponents.org][wcorg], the example below will render as an interactive demo. Otherwise, find the standalone examples below.

[wcorg]: https://www.webcomponents.org/element/qwtel/hy-drawer

<!--
```
<custom-element-demo height="250">
  <template>
    <script src="https://unpkg.com/@webcomponents/webcomponentsjs@1.1.0"></script>
    <link rel="import" href="https://unpkg.com/hy-drawer/dist/webcomponent/hy-drawer.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<hy-drawer id="drawer" align="left" touch-events mouse-events>
  <p>Arbitrary content here.</p>
</hy-drawer>

<a onclick="window.drawer.toggle()">☰</a>
```

When viewing this document on GitHub, npm, or elsewhere, you can check out the standalone examples:

* [WebComponent Example](https://qwtel.com/hy-drawer/example/webcomponent/){:.external}
* [jQuery Example](https://qwtel.com/hy-drawer/example/jquery/){:.external}
* [Vanilla JS Example](https://qwtel.com/hy-drawer/example/vanilla/){:.external}
* [Mixin Example](https://qwtel.com/hy-drawer/example/mixin/){:.external}


## License
**hy-drawer** is Open Source but not free.

You may use the component in accordance with the [GPL-3.0 license](licenses/GPL-3.0.md),
but this means you must be willing to release your code under a GPLv3-compatible license in turn.

For cases were this is not acceptable the following commercial licenses available:

|              | Personal           | Startup            | Enterprise         |
|:-------------|:------------------:|:------------------:|:------------------:|
| # Developers | 2                  | 15                 | ∞                  |
| License      | [Personal][pl]     | [Startup][sl]      | [Enterprise][el]   |
| Price        | $29                | $249               | $499               |
| | [**Buy**][bp]{:.gumroad-button} | [**Buy**][bs]{:.gumroad-button} | [**Buy**][be]{:.gumroad-button} |
{:.stretch-table}


[pl]: licenses/personal.md
[sl]: licenses/startup.md
[el]: licenses/enterprise.md
[bp]: https://gumroad.com/l/hy-drawer-personal
[bs]: https://gumroad.com/l/hy-drawer-startup
[be]: https://gumroad.com/l/hy-drawer-enterprise


## Usage
**hy-drawer** can be used in a variety of ways:
* As [Web Component](usage/#web-component), both as *ES6 Module* and *HTML Import*
* As [jQuery](usage/#jquery) plugin
* As [Vanilla](usage/#vanilla) JavaScript class
* As part of [bundled frontend code](usage/#bundlers).
* (Advanced) Possibly as part of your own component hierarchy as [ES6 Mixin][esmixins].

[esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

### Web Component
The Web Component is the preferred way of using **hy-drawer**, but requires [support] in the browser or a [polyfill]. There are multiple ways of including it on your page:

[support]: https://caniuse.com/#feat=template,custom-elementsv1,shadowdomv1,es6-module,imports
[polyfill]: https://github.com/webcomponents/webcomponentsjs

#### Bundled ES6 Module
This is the version that is going to have native support across all major browsers the soonest.

~~~html
<script type="module" href="https://unpkg.com/hy-drawer/dist/webcomponent/module.js"></script>

<hy-drawer touch-events prevent-default><!-- ... --></hy-drawer>
~~~

#### HTML Import
Some browsers have decided against implementing HTML Imports, but they are easily polyfilled.

~~~html
<link rel="import" href="https://unpkg.com/hy-drawer/dist/webcomponent/hy-drawer.html">

<hy-drawer touch-events prevent-default><!-- ... --></hy-drawer>
~~~

#### Unbundled ES6 Module (experimental)
When loading the component form the [unpkg] CDN, you can import the source directly by appending the `?module` query parameter.

~~~html
<script type="module" src="https://unpkg.com/hy-drawer/src/webcomponent/module?module"></script>

<hy-drawer touch-events prevent-default><!-- ... --></hy-drawer>
~~~

Note that this approach will result in hundreds of separate HTTP requests (one for each module) and is intended for testing and prototypes only. Importing unbundled ES6 modules is much slower than bundled distributions and will remain so for the foreseeable future.

One advantage of this approach is that shared dependencies will not be included twice when using more than one component from the hy-* component family. However, setting up webpack is a better solution in these cases:

#### Bundlers
You can use **hy-drawer** with a frontend bundler like webpack or rollup.
Just install the component with npm or yarn and import the source in your code:

```js
import 'hy-drawer/src/webcomponent/module';
```

If you want to have control over when the custom element gets `define`d, you can also import the `HTMLElement` like so:

```js
import { HyDrawerElement } from 'hy-drawer/src/webcomponent';
// ...
customElements.define('hy-drawer', HyDrawerElement);
```

Note that all of **hy-drawer**'s dependencies are valid ES6 modules, so that they can be inlined with webpack's [`ModuleConcatenationPlugin`][mcp].

[support]: https://caniuse.com/#feat=template,custom-elementsv1,shadowdomv1,es6-module,imports
[polyfill]: https://github.com/webcomponents/webcomponentsjs
[unpkg]: https://unpkg.com/
[mcp]: https://webpack.js.org/plugins/module-concatenation-plugin/


## Documentation

* [Options](doc/options.md)
* [Methods](doc/methods.md)
* [Events](doc/events.md)
* [Styling](doc/styling.md)

### Gold Standard
This component follows the WebComponents [Gold Standard](doc/gold-standard.md).

### Source
The source code is written in a *literal programming* style, and should be reasonably approachable.
However, some knowledge of [RxJS] is required.

The core functionality is implemented in [`mixin / index.js`](doc/source/mixin/README.md),
which is used to create the framework-specific versions of the component.

* `jquery`
  * [`index.js`](doc/source/jquery/README.md)
* `mixin`
  * [`calc.js`](doc/source/mixin/calc.md)
  * [`constants.js`](doc/source/mixin/constants.md)
  * [`index.js`](doc/source/mixin/README.md)
  * [`observables.js`](doc/source/mixin/observables.md)
  * [`operators.js`](doc/source/mixin/operators.md)
  * [`setup.js`](doc/source/mixin/setup.md)
  * [`update.js`](doc/source/mixin/update.md)
* `vanilla`
  * [`index.js`](doc/source/vanilla/README.md)
* `webcomponent`
  * [`html-import.js`](doc/source/webcomponent/html-import.md)
  * [`index.js`](doc/source/webcomponent/README.md)
  * [`module.js`](doc/source/webcomponent/module.md)
* [`common.js`](doc/source/common.md)
* [`index.js`](doc/source/README.md)

### Size
The size of the minified bundle is around 80kb, or ~17kb gzipped.
The majority of it comes from RxJS. When already using RxJS in your project, or using more than one component of the Hydejack component family, consider using a [frontend bundler](usage/README.md#bundlers).

| Size | File |
|-----:|:-----|
|  67K | `dist/jquery/index.js` |
|  15K | `dist/jquery/index.js.gz` |
|  63K | `dist/mixin/index.js` |
|  14K | `dist/mixin/index.js.gz` |
|  65K | `dist/vanilla/index.js` |
|  14K | `dist/vanilla/index.js.gz` |
|  69K | `dist/webcomponent/html-import.js` |
|  15K | `dist/webcomponent/html-import.js.gz` |
|  71K | `dist/webcomponent/index.js` |
|  16K | `dist/webcomponent/index.js.gz` |
|  71K | `dist/webcomponent/module.js` |
|  16K | `dist/webcomponent/module.js.gz` |


[rxjs]: https://github.com/ReactiveX/rxjs
[support]: https://caniuse.com/#feat=template,custom-elementsv1,shadowdomv1,es6-module,imports
[polyfill]: https://github.com/webcomponents/webcomponentsjs
[unpkg]: https://unpkg.com/
[mcp]: https://webpack.js.org/plugins/module-concatenation-plugin/
