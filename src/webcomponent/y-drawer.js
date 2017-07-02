// y-drawer  Copyright (C) 2017  Florian Klampfer
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

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import htmlElement from 'y-component/src/html-element';

import drawerCore from '../core';

// Older browsers don't treat `HTMLElement` as a class,
// which would cause an exception from just importing the class below (even when never using it)
// Replacing it with a dummy function prevents this.
const HTMLElement = typeof global.HTMLElement === 'function' ? global.HTMLElement : () => {};

export default class extends htmlElement(drawerCore(HTMLElement)) {}
