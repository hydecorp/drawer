<!--more-->

## Examples

* [Mixin Example](https://qwtel.com/hy-drawer/example/mixin/){:.external}
* [Vanilla JS Example](https://qwtel.com/hy-drawer/example/vanilla/){:.external}
* [jQuery Example](https://qwtel.com/hy-drawer/example/jquery/){:.external}
* [WebComponent Example](https://qwtel.com/hy-drawer/example/webcomponent/){:.external}


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

* [Options](doc/options.md){:.flip-title}
* [Methods](doc/methods.md){:.flip-title}
* [Events](doc/events.md){:.flip-title}
* [Styling](doc/styling.md){:.flip-title}

### Usage
The most straight-forward way to use **hy-drawer** is by using the vanilla JS version and load it from a CDN:

~~~html
<link rel="stylesheet" href="https://unpkg.com/hy-drawer/dist/style.css">
<script src="https://unpkg.com/hy-drawer/dist/vanilla/hy-drawer.min.js"></script>
~~~

~~~html
<aside id="drawerEl"><!--content--></aside>
<script>
  var HyDrawer = window.hyDrawer.HyDrawer;
  var drawer = new HyDrawer(window.drawerEl, { /* options */ });
</script>
~~~

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
