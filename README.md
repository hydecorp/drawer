# hy-drawer

**hy-drawer** is a touch-enabled drawer component for the modern web.
It focuses on providing a fun, natural feel in both the Android and iOS stock browser,
while being performant and easy to use.
It is the perfect companion for mobile-first web pages and progressive web apps.
[Try it!](example/mixin/){:.no-push-state}.

> A touch-enabled drawer component for the modern web.
{:.lead}

**hy-drawer** has idiomatic integrations for a variety of tools and frameworks:
* As **Vanilla** JavaScript class
* As **jQuery** plugin
* As **WebComponent**, either standalone or via HTML Import
* Possibly as part of your own component hierarchy via "[ES6 Mixin][1]" (they are just classes!).

The component was initially developed and is still used by [Hydejack](https://qwtel.com/hydejack/).
It is part of the hy-component family.

## License
The component is [GPL licensed](LICENSE.md), meaning you cannot use it in a project that isn't itself GPL licensed. For cases where this is not acceptable, there are commercial licenses available.

TODO

## Examples
* [Mixin Example](example/mixin/){:.no-push-state}
* [Vanilla JS Example](example/vanilla/){:.no-push-state}
* [jQuery Example](example/jquery/){:.no-push-state}
* [WebComponent Example](example/webcomponent/){:.no-push-state}

## Documentation

* [Options](doc/options.md)
* [Methods](doc/methods.md)
* [Events](doc/events.md)
* [Source](doc/source.md)

## Usage
The most straight-forward way to use **hy-drawer** is by using the vanilla JS version and load it from a CDN:

~~~html
<link type="text/css" rel="stylesheet"
  href="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.min.css">
<script type="application/javascript"
   src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.min.js"></script>
~~~

~~~html
<aside id="drawerEl"><!-- content --></aside>
<script>
  var Drawer = yDrawer.Drawer;
  var drawer = new Drawer(drawerEl, { /* options */ });
</script>
~~~

Usage is different for other platforms. For more see [Usage](doc/usage/README.md){:.flip-title}.

[1]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
