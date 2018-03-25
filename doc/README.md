# Documentation

* [Options](options.md)
* [Methods](methods.md)
* [Events](events.md)
* [Styling](styling.md)

## Usage
**hy-drawer** can be used in a variety of ways:
* As [Web Component](#web-component), both as *ES6 Module* and *HTML Import*
* As [jQuery](#jquery)
* As [Vanilla](#vanilla) JavaScript class
* (Advanced) Possibly as part of your own component hierarchy as [ES6 Mixin][esmixins].
* (Advanced) As part of your bundled frontend code.

[esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

### Web Component
The Web Component is the preferred way of using **hy-drawer**, but requires Web Component [support] in the browser or a [polyfill].

[support]: https://caniuse.com/#feat=template,custom-elementsv1,shadowdomv1,es6-module,imports
[polyfill]: https://github.com/webcomponents/webcomponentsjs

#### Bundled ES6 Module
This is the version that is going to have native support across all major browsers the soonest.

~~~html
<script type="module" href="https://unpkg.com/hy-drawer/dist/webcomponent/module.js"></script>

<hy-drawer align="left" prevent-default>
  <aside><!-- ... --></aside>
</hy-drawer>
~~~

#### HTML Import
Some browsers have decided against implementing HTML Imports, but they are easily polyfilled.

~~~html
<link rel="import" href="https://unpkg.com/hy-drawer/dist/webcomponent/hy-drawer.html">

<hy-drawer align="left" prevent-default>
  <aside><!-- ... --></aside>
</hy-drawer>
~~~

#### Unbundled ES6 Module (experimental)
The [unpkg CDN](https://unpkg.com/) can rewrite all bare import paths with valid unpkg URLs by passing the `?module` query parameter.
This allows importing **hy-drawer**'s source directly.
Note that this will result in possibly hundreds of separate requests.

~~~html
<script type="module" src="https://unpkg.com/hy-drawer/src/webcomponent/module?module"></script>

<hy-drawer align="left" prevent-default>
  <aside><!-- ... --></aside>
</hy-drawer>
~~~

### jQuery

~~~html
<aside id="drawer" data-align="left" data-prevent-default="true"><!-- ... --></aside>

<script src="https://unpkg.com/jquery"></script>
<script src="https://unpkg.com/hy-drawer/dist/jquery"></script>
<script>$('#drawer').drawer()</script>
~~~

### Vanilla
~~~html
<aside id="drawer"><!-- ... --></aside>

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

## Size
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

## Gold Standard
This component follows the WebComponents [Gold Standard](gold-standard.md){:.flip-title}.

## Source
The source code is written in a *literal programming* style, and should be reasonably approachable.
However, some knowledge of [RxJS] is required.

The core functionality is implemented in [`mixin / index.js`](source/mixin/README.md),
which is used to create the framework-specific versions of the component.

* `jquery`
  * [`index.js`](source/jquery/README.md)
* `mixin`
  * [`calc.js`](source/mixin/calc.md)
  * [`constants.js`](source/mixin/constants.md)
  * [`index.js`](source/mixin/README.md)
  * [`observables.js`](source/mixin/observables.md)
  * [`operators.js`](source/mixin/operators.md)
  * [`setup.js`](source/mixin/setup.md)
  * [`update.js`](source/mixin/update.md)
* `vanilla`
  * [`index.js`](source/vanilla/README.md)
* `webcomponent`
  * [`html-import.js`](source/webcomponent/html-import.md)
  * [`index.js`](source/webcomponent/README.md)
  * [`module.js`](source/webcomponent/module.md)
* [`common.js`](source/common.md)
* [`index.js`](source/README.md)

[rxjs]: https://github.com/ReactiveX/rxjs
