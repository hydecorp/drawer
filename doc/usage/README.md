---
title: Usage
---

### CDN
For every bundle there are three versions that you can pick from.

#### .min.js
The `.min.js` version is the go-to, batteries-included version that you should use.
~~~html
<script src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.min.js"></script>
~~~

#### -lite.min.js
The `-lite.min.js` version does not bundle `core-js` polyfills.
It is slightly smaller and can be used when you only target modern browsers, or when you've already patched the environment with `core-js` or similar.
~~~html
<script src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer-lite.min.js"></script>
~~~

#### .js
The unminified version (`.js`) should only be used for development.
~~~html
<script src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.js"></script>
~~~

#### Platform
Note that you can replace `vanilla` with your desired platform, which can be any of
* `vanilla`
* `jquery`
* `webcomponent`
* `mixin`

How the component is used depends on the platform (see below).

#### Stylesheet
If you chose `vanilla`, `jquery`, or `mixin`, you need to also include the stylesheet (the WebComponent comes bundled with its own stylesheet):

~~~html
<link href="https://unpkg.com/hy-drawer/dist/vanilla/style.css" rel="stylesheet" type="text/css">
~~~

{% comment %}
<!--- #### Vanilla JS
The vanilla JS class is defined within the global `yDrawer` namespace and is called `Drawer`:

~~~html
<link href="https://unpkg.com/hy-drawer/dist/vanilla/style.css" rel="stylesheet" type="text/css">
<script src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.min.js"></script>
<script>
  var Drawer = yDrawer.Drawer;
  var drawer = new Drawer(document.getElementById('drawerEl'));
</script>
~~~

#### jQuery
As is typical for jQuery plugins, it will patch the existing jQuery instance,
so you only need to call `drawer` on your target element.

~~~html
<link href="https://unpkg.com/hy-drawer/dist/jquery/style.css" rel="stylesheet" type="text/css">
<script src="https://unpkg.com/jquery@3"></script>
<script src="https://unpkg.com/hy-drawer/dist/jquery/hy-drawer.min.js"></script>
<script>
  $('#drawerEl').drawer();
</script>
~~~ -->
{% endcomment %}

### npm
You can use `hy-drawer` as part of your webpack or browserify build chain by fetching the source from npm:

~~~sh
$ npm  install --save-dev hy-drawer
~~~

Usage depends on the platform:

#### Vanilla JS class
~~~js
const { Drawer } = require('hy-drawer/lib/vanilla');
const drawer = new Drawer(node);
~~~

#### jQuery Plugin
~~~js
const $ = require('jquery');
require('hy-drawer/lib/jquery'); // will monkey-patch $, as jQuery plugins usually do
~~~

#### WebComponent
~~~js
const { DrawerHTMLElement } = require('hy-drawer/lib/webcomponent');
customElements.define('hy-drawer', DrawerHTMLElement);
~~~

#### "ES6 Mixin" (advanced!)
~~~js
const { drawerMixin } = require('y-drawer/lib/mixin');
class MyDrawerComponent extends drawerMixin(MyBaseComponent) {
  // ...
}
~~~

Note that `lib` is precompiled to ES5 for convenience.
Should you target a different set, you can TODO

## Source
The source code is written in a "literal programming" style, and should be very approachable.
Preferred reading order:

* `mixin`
  * [`index.js`](../src/mixin/index.md)
* `vanilla`
  * [`index.js`](../src/vanilla/index.md)
* `jquery`
  * [`index.js`](../src/jquery/index.md)
* `webcomponent`
  * [`index.js`](../src/webcomponent/index.md)
  * [`html-import.js`](../src/webcomponent/html-import.md)
* [`common.js`](../src/common.md)


{% comment %}
## Old Version
y-drawer is a high-quality, (multi-)touch-enabled drawer menu for the mobile web.
It offers options to optimize it's behavior for either iOS or Android
(but no user-agent sniffing code is part of the core lib.

It as initially developed for [Hydejack](https://qwtel.com/hydejack/)
and is now available as a standalone component.

It is written with RxJS, but only includes the parts it is using, resulting in a size of ~50kB minified,
NOT gzipped.

It can be used as a vanilla JS class, jQuery plugin, WebComponent (both via HTML import or UMD module),
React component or as "ES6 mixin" for seamless integration in your own component library.
For details, see examples below.

CTO pitch:
The implementation uses the CSS `transform`, `opacity`, and (dynamically set) `will-change` attributes,
to ensure the minimum amount of repaints.
The animations use `requestAnimationFrame` instead of CSS animations/WebAnimations
in order to allow users to interrupt ("catch") the drawer duration the animation.
If the drawer reaches a certain velocity when it is released, it will into that direction,
i.e. it can be "flicked".
Should the drawer not reach a certain threshold velocity when it is released,
it will animate into whatever state it is closer in absolute terms.

## Usage Example
This is an example of how to use the component as a vanilla JS class.
For other libraries, see TODO.

~~~html
<!-- need to load the stylesheet -->
<link href="https://unpkg.com/hy-drawer@7/dist/vanilla/style.css" rel="stylesheet" type="text/css">

<!-- this element will be converted into the drawer -->
<aside id="drawerEl">
  <!-- can include arbitrary content -->
</aside>

<script src="https://unpkg.com/hy-drawer@7/dist/vanilla/hy-drawer.js"></script>
<script>
  // component exposes a global `yDrawer` namespace
  var Drawer = yDrawer.Drawer;

  // create drawer object via new
  var drawer = new Drawer(drawerEl, {
    preventDefault: true,
    edgeMargin: 15
  });

  // call methods on the drawer object
  drawer.open();
</script>
~~~


Vanilla/jQuery
~~~
core-js/fn/object/assign
core-js/fn/array/find
core-js/fn/function/bind
core-js/fn/array/for-each
core-js/fn/object/define-property
core-js/fn/object/keys
~~~

WebComponent:
~~~
core-js/fn/array/for-each
core-js/fn/object/keys
core-js/fn/object/assign
core-js/fn/array/map
core-js/fn/object/set-prototype-of
core-js/fn/reflect/construct
core-js/fn/string/trim
core-js/fn/number/constructor
core-js/fn/array/find
core-js/fn/function/bind
core-js/fn/object/define-property
~~~
{% endcomment %}
