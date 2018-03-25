// # src / webcomponent / html-import.js
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
// This in the HTML import version of the WebComponent version of this component.
// See [here](index.md) for the standalone version.
// This file is included via `script` tag in `hy-drawer.html` and shouldn't be used via ES import.

import { customElementMixin, CustomElement } from "hy-component/src/custom-element";

import { drawerMixin } from "../mixin";

const define = () => {
  customElements.define(
    "hy-drawer",
    class extends customElementMixin(drawerMixin(CustomElement)) {
      // The CustomElements spec demands that we provide a list of attributes (i.e. our options).
      static get observedAttributes() {
        return this.getObservedAttributes();
      }
    }
  );
};

// Make sure the polyfills are ready (if they are being used).
if (
  ("customElements" in window && "attachShadow" in Element.prototype) ||
  (window.WebComponents && window.WebComponents.ready)
) {
  define();
} else if (window.WebComponents) {
  window.addEventListener("WebComponentsReady", define);
} else if (process.env.DEBUG) {
  console.warn("Couldn't register component. Did you forget to include a WebComponents polyfill?");
}
