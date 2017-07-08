// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
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

import { customElementMixin, CustomElement } from 'y-component/src/custom-element';
import { drawerMixin } from '../mixin';

import template from './template.ejs'; // eslint-disable-line

function fragmentFromString(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}

export class DrawerHTMLElement extends customElementMixin(drawerMixin(CustomElement)) {
  // @override
  getTemplateInstance() { return fragmentFromString(template); }
}
