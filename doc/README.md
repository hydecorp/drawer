# Documentation

* [Options](options.md)
* [Methods](methods.md)
* [Events](events.md)
* [Styling](styling.md)

## Gold Standard
This component follows the WebComponents [Gold Standard](gold-standard.md).

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

## Size
The size of the minified bundle is around 80kb, or ~17kb gzipped.
The majority of it comes from RxJS. When already using RxJS in your project, or using more than one component of the Hydejack component family, consider using a [frontend bundler](../usage/README.md#bundlers).

| Size | File |
|-----:|:-----|
|  77K | `dist/jquery/index.js` |
|  16K | `dist/jquery/index.js.gz` |
|  73K | `dist/mixin/index.js` |
|  15K | `dist/mixin/index.js.gz` |
|  75K | `dist/vanilla/index.js` |
|  16K | `dist/vanilla/index.js.gz` |
|  78K | `dist/webcomponent/html-import.js` |
|  16K | `dist/webcomponent/html-import.js.gz` |
|  81K | `dist/webcomponent/index.js` |
|  17K | `dist/webcomponent/index.js.gz` |
|  81K | `dist/webcomponent/module.js` |
|  17K | `dist/webcomponent/module.js.gz` |


[rxjs]: https://github.com/ReactiveX/rxjs
[support]: https://caniuse.com/#feat=template,custom-elementsv1,shadowdomv1,es6-module,imports
[polyfill]: https://github.com/webcomponents/webcomponentsjs
[unpkg]: https://unpkg.com/
[mcp]: https://webpack.js.org/plugins/module-concatenation-plugin/
