# Documentation

* [Options](options.md){:.flip-title}
* [Methods](methods.md){:.flip-title}
* [Events](events.md){:.flip-title}
* [Styling](styling.md){:.flip-title}


## Gold Standard
This component follows the WebComponents [Gold Standard](gold-standard.md){:.flip-title}.

## Source
The source code is written in a *literal programming* style, and should be reasonably approachable.
However, some knowledge of [RxJS] is required.

The core functionality is implemented in [`mixin / index.js`](source/mixin/index.md),
which is used to create the framework-specific versions of the component.

* `jquery`
  * [`index.js`](source/jquery/index.md)
* `mixin`
  * [`calc.js`](source/mixin/calc.md)
  * [`constants.js`](source/mixin/constants.md)
  * [`index.js`](source/mixin/index.md)
  * [`observables.js`](source/mixin/observables.md)
  * [`operators.js`](source/mixin/operators.md)
  * [`setup.js`](source/mixin/setup.md)
  * [`update.js`](source/mixin/update.md)
* `vanilla`
  * [`index.js`](source/vanilla/index.md)
* `webcomponent`
  * [`html-import.js`](source/webcomponent/html-import.md)
  * [`index.js`](source/webcomponent/index.md)
  * [`module.js`](source/webcomponent/module.md)
* [`common.js`](source/common.md)
