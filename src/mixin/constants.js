// # src / mixin / constants.js
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

// The base duration of the fling animation.
export const BASE_DURATION = 200;

// We adjust the duration of the animation using the width of the drawer.
// There is no physics to this, but we know from testing that the animation starts to feel bad
// when the drawer increases in size.
// From testing we know that, if we increase the duration as a fraction of the drawer width,
// the animation stays smooth across common display sizes.
export const WIDTH_CONTRIBUTION = 0.15;

// If `Symbol` isn't supported, just use underscore naming convention for private properties.
const Symbol = global.Symbol || (x => `_${x}`);

// We use `Symbol`s for all internal variables, to avoid naming conflicts when using the mixin.
// Instead of using UPPERCASE names for symbols, which makes the code too verbose,
// we prefix every symbol with the letter 's'.
export const sOpened$ = Symbol('openedObservable');
export const sAlign$ = Symbol('alignObservable');
export const sPersitent$ = Symbol('persistentObservable');
export const sPreventDefault$ = Symbol('preventDefaultObservable');
export const sMouseEvents$ = Symbol('mouseEventsObservable');
export const sBackButton$ = Symbol('backButtonObservable');
export const sAnimateTo$ = Symbol('animateToObservable');
export const sDrawerWidth = Symbol('drawerWidth');
export const sScrimEl = Symbol('scrimElement');
export const sContentEl = Symbol('contentElement');
export const sScrollEl = Symbol('scrollElement');
export const sTranslateX = Symbol('translateX');
export const sOpacity = Symbol('opacity');
