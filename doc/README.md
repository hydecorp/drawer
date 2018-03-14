# Documentation

* [Options](options.md){:.flip-title}
* [Methods](methods.md){:.flip-title}
* [Events](events.md){:.flip-title}
* [Styling](styling.md){:.flip-title}

## Usage
The most straight-forward way to use **hy-drawer** is by using the vanilla JS version and load it from a CDN:

~~~html
<link rel="stylesheet" href="https://unpkg.com/hy-drawer/dist/vanilla/style.css">
<script src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.min.js"></script>
~~~

~~~html
<aside id="drawerEl"><!--content--></aside>
<script>
  var HyDrawer = window.hyDrawer.HyDrawer;
  var drawer = new HyDrawer(window.drawerEl, { /* options */ });
</script>
~~~

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
