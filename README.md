# hy-drawer

[![npm version](https://badge.fury.io/js/hy-drawer.svg)](https://badge.fury.io/js/hy-drawer)

**hy-drawer** is a touch-enabled drawer component for the modern web.
It focuses on providing a fun, natural feel in both the Android and iOS stock browser,
while being performant and easy to use.
It is the perfect companion for mobile-first web pages and progressive web apps.

> A touch-enabled drawer component for the modern web.
{:.lead}

**hy-drawer** is used by hundreds of sites as part of the [Hydejack]{:.external} Jekyll theme.

**NOTE**: The current version is a pre-release. The public API may still change in important ways.
{:.message}

[hydejack]: https://qwtel.com/hydejack/

<!--more-->

## Examples
The example below will render on [webcomponents.org](https://www.webcomponents.org/element/qwtel/hy-drawer):

<!--
```
<custom-element-demo height="250">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="https://unpkg.com/hy-drawer/dist/webcomponent/hy-drawer.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<hy-drawer id="drawer" align="left" mouse-events>
 <aside>
   <p>Arbitrary content here.</p>
 </aside>
</hy-drawer>

<a onclick="window.drawer.toggle()">☰</a>
```

When viewing this document on qwtel.com, GitHub, npm, or elsewhere, you can check out the links to standalone examples:

* [WebComponent Example](https://qwtel.com/hy-drawer/example/webcomponent/){:.external}
* [jQuery Example](https://qwtel.com/hy-drawer/example/jquery/){:.external}
* [Vanilla JS Example](https://qwtel.com/hy-drawer/example/vanilla/){:.external}
* [Mixin Example](https://qwtel.com/hy-drawer/example/mixin/){:.external}


## License

|              | Personal           | Startup            | Enterprise         |
|:-------------|:------------------:|:------------------:|:------------------:|
| # Developers | 2                  | 15                 | ∞                  |
| License      | [Personal][pl]     | [Startup][sl]      | [Enterprise][el]   |
| Price        | $29                | $249               | $499               |
| | [**Buy**][bp]{:.gumroad-button} | [**Buy**][bs]{:.gumroad-button} | [**Buy**][be]{:.gumroad-button} |
{:.stretch-table}

Unless you've obtained one of the licenses above, **hy-drawer** must be used in accordance with the [GPL-3.0](LICENSE.md) license.

[pl]: licenses/personal.md
[sl]: licenses/startup.md
[el]: licenses/enterprise.md
[bp]: https://gumroad.com/l/hy-drawer-personal
[bs]: https://gumroad.com/l/hy-drawer-startup
[be]: https://gumroad.com/l/hy-drawer-enterprise


## Documentation

* [Options](doc/options.md)
* [Methods](doc/methods.md)
* [Events](doc/events.md)
* [Styling](doc/styling.md)

### Usage
**hy-drawer** can be used in a variety of ways:
* As [Web Component](#web-component), both as *ES6 Module* and *HTML Import*
* As [jQuery](#jquery)
* As [Vanilla](#vanilla) JavaScript class
* (Advanced) Possibly as part of your own component hierarchy as [ES6 Mixin][esmixins].
* (Advanced) As part of your bundled frontend code.

[esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

#### Web Component
The Web Component is the preferred way of using **hy-drawer**, but requires Web Component [support] in the browser or a [polyfill].

[support]: https://caniuse.com/#feat=template,custom-elementsv1,shadowdomv1,es6-module,imports
[polyfill]: https://github.com/webcomponents/webcomponentsjs

##### Bundled ES6 Module
This is the version that is going to have native support across all major browsers the soonest.

~~~html
<script type="module" href="https://unpkg.com/hy-drawer/dist/webcomponent/module.js"></script>

<hy-drawer align="left" prevent-default>
  <aside><!-- ... --></aside>
</hy-drawer>
~~~

##### HTML Import
Some browsers have decided against implementing HTML Imports, but they are easily polyfilled.

~~~html
<link rel="import" href="https://unpkg.com/hy-drawer/dist/webcomponent/hy-drawer.html">

<hy-drawer align="left" prevent-default>
  <aside><!-- ... --></aside>
</hy-drawer>
~~~

##### Unbundled ES6 Module (experimental)
The unpkg CDN can rewrite all "bare" import paths with valid unpkg URLs by passing the `?module` query parameter.
This allows importing **hy-drawer**'s source directly.
Note that this will result in possibly hundreds of separate requests.

~~~html
<script>window.process = { env: { DEBUG: true } };</script>

<script type="module" src="https://unpkg.com/hy-drawer/src/webcomponent/module?module"></script>

<hy-drawer align="left" prevent-default>
  <aside><!-- ... --></aside>
</hy-drawer>
~~~

#### jQuery

~~~html
<aside id="drawer" data-align="left" data-prevent-default="true"><!-- ... --></aside>

<script src="https://unpkg.com/jquery"></script>
<script src="https://unpkg.com/hy-drawer/dist/jquery"></script>
<script>$('#drawer').drawer()</script>
~~~

#### Vanilla
~~~html
<aside id="drawer"><!--content--></aside>

<script src="https://unpkg.com/hy-drawer/dist/vanilla"></script>
<script>
  var HyDrawer = window.hyDrawer.HyDrawer;
  var drawerEl = document.getElementById('drawer');
  drawerEl.component = new HyDrawer(drawerEl, {
    align: 'left',
    preventDefault: true,
  });
</script>
~~~

### Size
The size of the minified bundle hovers around 75kb, or ~15kb gzipped.

| File | Size |
|:-----|-----:|
| `dist/jquery/index.js` | 296K |
| `dist/jquery/index.min.js` |  71K |
| `dist/mixin/index.js` | 284K |
| `dist/mixin/index.min.js` |  67K |
| `dist/vanilla/index.js` | 289K |
| `dist/vanilla/index.min.js` |  69K |
| `dist/webcomponent/html-import.js` | 298K |
| `dist/webcomponent/html-import.min.js` |  73K |
| `dist/webcomponent/index.js` | 301K |
| `dist/webcomponent/index.min.js` |  75K |
| `dist/webcomponent/module.js` | 302K |
| `dist/webcomponent/module.min.js` |  75K |

### Gold Standard
This component follows the WebComponents [Gold Standard](doc/gold-standard.md){:.flip-title}.

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

[rxjs]: https://github.com/ReactiveX/rxjs
