# YDrawer

YDrawer is a touch-enabled drawer menu for the mobile web.
It focuses on providing a fun, natural feel in both the Android and iOS stock browser,
while being performant and easy to use.
It is the perfect companion for mobile-first web pages or (progressive-) web apps.
[Give it a try!](example/mixin/index.html){:.no-push-state}.

YDrawer can be used with a variety of tools and frameworks:
* As Vanilla JavaScript class
* As jQuery plugin
* As WebComponent, either standalone or via HTML Import
* Possibly as part of your own component hierarchy via "[ES6 Mixin][1]".

The source code should be very approachable, as it is written in a "literal programming" style, and structured like a blog post. You can read it [here](doc/src/mixin/index.md).

The drawer is currently used in the wild by Hydejack.

It is part of the `y-components` family, that currently has `y-push-state` as another member.

## License
The component is [GPL licensed](LICENSE.md), meaning you cannot use it in a project that isn't itself GPL licensed. For cases where this is not acceptable, there are commercial licenses available.

## Usage
### CDN
For every bundle there are three versions that you can pick from
* The minified version (`.min.js`) contains in the go-to, batteries-included version that you should use.
* The lite version (`-lite.min.js`) does not bundle `core-js` polyfills for ES6 functions.
  It is slightly smaller and can be used when you only target modern browsers, or when you've already patched the environment with `core-js` or similar yourself.
* The unminified version (`.js`) should only be used for development

~~~html
<script src="https://unpkg.com/y-drawer/dist/vanilla/y-drawer.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/y-drawer/dist/vanilla/y-drawer-lite.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/y-drawer/dist/vanilla/y-drawer.js"></script>
~~~

Note that you can replace `vanilla` with your desired platform, which can be any of `vanilla`, `jquery`, `webcomponent` or `mixin`. How the component is used depends on the platform (see below).

If you chose `vanilla`, `jquery`, or `mixin`, you need to also include the stylesheet (the WebComponent comes bundled with its own stylesheet):

~~~html
<link href="https://unpkg.com/y-drawer/dist/vanilla/style.css" rel="stylesheet" type="text/css">
~~~

<!-- #### Vanilla JS
The vanilla JS class is defined within the global `yDrawer` namespace and is called `Drawer`:

~~~html
<link href="https://unpkg.com/y-drawer/dist/vanilla/style.css" rel="stylesheet" type="text/css">
<script src="https://unpkg.com/y-drawer/dist/vanilla/y-drawer.min.js"></script>
<script>
  var Drawer = yDrawer.Drawer;
  var drawer = new Drawer(document.getElementById('drawerEl'));
</script>
~~~

#### jQuery
As is typical for jQuery plugins, it will patch the existing jQuery instance,
so you only need to call `drawer` on your target element.

~~~html
<link href="https://unpkg.com/y-drawer/dist/jquery/style.css" rel="stylesheet" type="text/css">
<script src="https://unpkg.com/jquery@3"></script>
<script src="https://unpkg.com/y-drawer/dist/jquery/y-drawer.min.js"></script>
<script>
  $('#drawerEl').drawer();
</script>
~~~ -->

### npm
You can use `y-drawer` as part of your webpack or browserify build chain by fetching the source from npm:

    npm  install --save-dev y-drawer

Usage depends on the

~~~js
// As Vanilla JS class
const { Drawer } = require('y-drawer/lib/vanilla');
const drawer = new Drawer(node);

// As jQuery Plugin
const $ = require('jquery');
// will monkey-patch $, as jQuery plugins usually do
require('y-drawer/lib/jquery');

// As WebComponent
const { DrawerHTMLElement } = require('y-drawer/lib/webcomponent');
customElements.define('y-drawer', DrawerHTMLElement);

// As "ES6 Mixin" (advanced!)
const { drawerMixin } = require('y-drawer/lib/mixin');
class MyDrawerComponent extends drawerMixin(MyComponent) {
  // ...
}
~~~

Note that `lib` is precompiled to ES5 for convenience.
Should you target a different set, you can TODO

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
<link href="https://unpkg.com/y-drawer@7/dist/vanilla/style.css" rel="stylesheet" type="text/css">

<!-- this element will be converted into the drawer -->
<aside id="drawerEl">
  <!-- can include arbitrary content -->
</aside>

<script src="https://unpkg.com/y-drawer@7/dist/vanilla/y-drawer.js"></script>
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

## Examples
* [Mixin Example](example/mixin/){:.no-push-state}
* [Vanilla JS Example](example/vanilla/){:.no-push-state}
* [jQuery Example](example/jquery/){:.no-push-state}
* [WebComponent HTML Import Example](example/webcomponent/){:.no-push-state}

[1]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
