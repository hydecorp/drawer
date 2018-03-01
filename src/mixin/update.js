// # src / mixin / update.js
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

import {
  sScrimEl,
  sContentEl,
  sTranslateX,
  sOpacity,
} from './constants';


// ### Private Methods
// The functions are used as "private" methods on the mixin, using the `::` syntax.
export function histId() {
  return this.el.id || this.constructor.componentName;
}

// #### Prepare and cleanup interaction
// `prepareInteraction` causes various side effects before sliding the drawer.
//
// Note that the drawer receives the `hy-drawer-opened` CSS class when it is opened.
// This class makes the drawer appear open by setting the CSS `left` (`right`) property, instead
// of an absoulte `transform` value.
// This way, the drawer's width can change while it is open without having to
// recalculate `translateX` on every `resize`.
// However, it has to be removed before we move the drawer via `translateX` again.
export function prepareInteraction() {
  this[sContentEl].style.willChange = 'transform';
  this[sScrimEl].style.willChange = 'opacity';
  this[sContentEl].classList.remove('hy-drawer-opened');
  this.fireEvent('prepare');
}

// Cleanup code after a completed interaction.
// Will add/remove the beforementioned `hy-drawer-opened` class.
export function cleanupInteraction(opened) {
  this[sScrimEl].style.willChange = '';
  this[sContentEl].style.willChange = '';

  if (opened) {
    this[sScrimEl].style.pointerEvents = 'all';
    this[sContentEl].classList.add('hy-drawer-opened');
  } else {
    this[sScrimEl].style.pointerEvents = '';
    this[sContentEl].classList.remove('hy-drawer-opened');
  }

  // If the experimental back button feature is enabled we hack the history API,
  // so that it matches the state of the drawer...
  if (this._backButton) {
    const id = histId.call(this);
    const hash = `#${id}--opened`;

    if (opened && window.location.hash !== hash) {
      window.history.pushState({ [id]: true }, document.title, hash);
    }

    if (!opened
        && (window.history.state && window.history.state[histId.call(this)])
        && window.location.hash !== '') {
      window.history.back();
    }
  }

  // Once we're finished cleaning up, we fire the `transitioned` event.
  this.fireEvent('transitioned', { detail: opened });
}

// #### Update DOM
// In the end, we only modify two properties: The x-coordinate of the drawer,
// and the opacity of the scrim, which is handled by `updateDOM`.
export function updateDOM(translateX) {
  this[sTranslateX] = translateX;

  const inv = this.align === 'left' ? 1 : -1;
  const opacity = this[sOpacity] = (translateX / this.drawerWidth) * inv;

  this[sContentEl].style.transform = `translateX(${translateX}px)`;
  this[sScrimEl].style.opacity = this.opacity;

  this.fireEvent('move', { detail: { translateX, opacity } });
}
