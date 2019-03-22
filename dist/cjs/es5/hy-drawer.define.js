"use strict";
// HyDrawer: Custom Elements Define Library, ES Module/es5 Target
Object.defineProperty(exports, "__esModule", { value: true });
var hy_drawer_core_js_1 = require("./hy-drawer.core.js");
var hy_drawer_components_js_1 = require("./hy-drawer.components.js");
function defineCustomElements(win, opts) {
    return hy_drawer_core_js_1.defineCustomElement(win, hy_drawer_components_js_1.COMPONENTS, opts);
}
exports.defineCustomElements = defineCustomElements;
