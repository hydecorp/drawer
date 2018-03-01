// # src / mixin / index.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ## Overview
// This component is written in [RxJS] and reading its code requires some basic understanding
// of how RxJS works. It may also serve as an example of how to use RxJS.
//
// Other than RxJS, you should be familiar with [ES6 Mixin][esmixins],
// which is a clever way of using the ES6 class syntax to achieve inheritance-based mixins.
// The mixin in the main export of this file.

// ## Imports
// ES6+ functions that we use.
import 'core-js/fn/array/from';
import 'core-js/fn/function/bind';
import 'core-js/fn/object/assign';

// Importing the hy-compontent base libary,
// which helps with making multiple versions of the component (Vanilla JS, WebComponent, etc...).
import { componentMixin, COMPONENT_FEATURE_TESTS } from 'hy-component/src/component';
import { sSetup, sSetupDOM, sFire } from 'hy-component/src/symbols';

// Small little helpers:
import { arrayOf, bool, number, string, oneOf } from 'attr-types';
import { Set } from 'qd-set';

// TODO
import { setupObservables } from './setup';

// ## Constants
import {
  sOpened$,
  sAlign$,
  sPersitent$,
  sPreventDefault$,
  sMouseEvents$,
  sBackButton$,
  sAnimateTo$,
  sDrawerWidth,
  sScrimEl,
  sContentEl,
  sScrollEl,
  sTranslateX,
  sOpacity,
} from './constants';

// A set of [Modernizr] tests that are required for this component to work.
export const MIXIN_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
  'eventlistener',
  'queryselector',
  'requestanimationframe',
  'classlist',
  'opacity',
  'csstransforms',
  'csspointerevents',
]);

// We export the setup symbols,
// so that mixin users don't have to import them from hy-compnent separately.
export { sSetup, sSetupDOM };

// ## Drawer Mixin
export function drawerMixin(C) {
  // TODO: see ES6 mixins...
  return class extends componentMixin(C) {
    // The name of the component (required by hy-component)
    static get componentName() { return 'hy-drawer'; }

    // ### Setup
    // Overriding the setup function.
    [sSetup](el, props) {
      super[sSetup](el, props);

      // Cache DOM elements.
      this[sScrimEl] = this.root.querySelector('.hy-drawer-scrim');
      this[sContentEl] = this.root.querySelector('.hy-drawer-content');
      if (this._hideOverflow) this[sScrollEl] = document.querySelector(this._hideOverflow);

      // Set the initial alignment class.
      this[sContentEl].classList.add(`hy-drawer-${this.align}`);

      // Finally, calling the [setup observables function](#setup-observables) function.
      setupObservables.call(this);

      // Firing an event to let the outside world know the drawer is ready.
      this[sFire]('init', { detail: this.opened });

      // Allow function chaining.
      return this;
    }

    // ### Options
    // The default values (and types) of the configuration options (required by hy-component)
    // See [Options](../../options.md) for usage information.
    static get defaults() {
      return {
        opened: false,
        align: 'left',
        persistent: false,
        range: [0, 100],
        threshold: 10,
        preventDefault: false,
        mouseEvents: false,
        _backButton: false,
        _hideOverflow: null,
      };
    }

    static get types() {
      return {
        opened: bool,
        align: oneOf(['left', 'right']),
        persistent: bool,
        range: arrayOf(number),
        threshold: number,
        preventDefault: bool,
        mouseEvents: bool,
        _backButton: bool,
        _hideOverflow: string,
      };
    }

    // Side effects of changing configuration options (if any).
    // Mostly we just put the value on an observable and deal with it from there.
    static get sideEffects() {
      return {
        opened(x) { this[sOpened$].next(x); },
        align(x) { this[sAlign$].next(x); },
        persistent(x) { this[sPersitent$].next(x); },
        preventDefault(x) { this[sPreventDefault$].next(x); },
        mouseEvents(x) { this[sMouseEvents$].next(x); },
        _backButton(x) { this[sBackButton$].next(x); },
        _hideOverflow(selector) {
          if (this[sScrollEl]) this[sScrollEl].style.overflow = '';
          this[sScrollEl] = document.querySelector(selector);
        },
      };
    }

    // ### Getters
    // Access to internal vairables
    get translateX() {
      return this[sTranslateX];
    }

    get drawerWidth() {
      return this[sDrawerWidth];
    }

    get opacity() {
      return this[sOpacity];
    }

    // ### Methods
    // Public methods of this component. See [Methods](../../methods.md) for more.
    open(animated = true) {
      if (animated) this[sAnimateTo$].next(true);
      else this.opened = true;
    }

    close(animated = true) {
      if (animated) this[sAnimateTo$].next(false);
      else this.opened = false;
    }

    toggle(animated = true) {
      if (animated) this[sAnimateTo$].next(!this.opened);
      else this.opened = !this.opened;
    }
  };
}

// This concludes the implementation of push-state mixin.
// You can now check out
//
// * [vanilla / index.js](../vanilla/index.md)
// * [jquery / index.js](../jquery/index.md)
// * [webcomponent / index.js](../webcomponent/index.md)
//
// to see how it is used.
//
// [rxjs]: https://github.com/ReactiveX/rxjs
// [esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
// [modernizr]: https://modernizr.com/
