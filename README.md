# hy-drawer

**hy-drawer** is a touch-enabled drawer component for the modern web.
It focuses on providing a fun, natural feel in both the Android and iOS stock browser,
while being performant and easy to use.
It is the perfect companion for mobile-first web pages and progressive web apps.

> A touch-enabled drawer component for the modern web.
{:.lead}

**hy-drawer** can be used in a variety of ways:
* As **Vanilla** JavaScript class
* As **jQuery** plugin
* As **WebComponent**, both as *ES6 Module* and *HTML Import*
* Possibly as part of your own component hierarchy via [ES6 Mixin][esmixins].

The component was initially developed --- and can be encountered in the wild ---
as part of the [Hydejack](https://qwtel.com/hydejack/) Jekyll theme.

**NOTE**: The current version is a custom build for Hydejack, which works fine but assumes that you don't do certain "evil" things,
like detaching and re-attaching it to the DOM, etc. This will be fixed in the 1.0.0 release.
{:.message}

## License
**hy-drawer** is [GPL-3.0](LICENSE.md)--licensed.
Commercial licenses will be available for cases where this is not suitable.

## Examples
* [Mixin Example](example/mixin/index.html){:.external}
* [Vanilla JS Example](example/vanilla/index.html){:.external}
* [jQuery Example](example/jquery/index.html){:.external}
* [WebComponent Example](example/webcomponent/index.html){:.external}

## Usage
The most straight-forward way to use **hy-drawer** is by using the vanilla JS version and load it from a CDN:

~~~html
<link rel="stylesheet" href="https://unpkg.com/hy-drawer/dist/vanilla/style.css">
<script src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.min.js"></script>
~~~

~~~html
<aside id="drawerEl"><!--content--></aside>
<script>
  var Drawer = window.hyDrawer.Drawer;
  var drawer = new Drawer(window.drawerEl, { /* options */ });
</script>
~~~

## Documentation

* [Options](doc/options.md)
* [Methods](doc/methods.md)
* [Events](doc/events.md)
* [Styling](doc/styling.md)

## Source
The source code is written in a *literal programming* style, and should be reasonably approachable.
However, some knowledge of [RxJS] is required.

The core functionality is implemented in [`mixin / index.js`](doc/source/mixin/index.md),
which is used to create the framework-specific versions of the component.

* `jquery`
  * [`index.js`](doc/source/jquery/index.md)
* `mixin`
  * [`index.js`](doc/source/mixin/index.md)
* `vanilla`
  * [`index.js`](doc/source/vanilla/index.md)
* `webcomponent`
  * [`index.js`](doc/source/webcomponent/index.md)
  * [`html-import.js`](doc/source/webcomponent/html-import.md)
* [`common.js`](doc/source/common.md)


[esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
[rxjs]: https://github.com/ReactiveX/rxjs
