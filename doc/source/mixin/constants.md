# src / mixin / constants.js
Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

The base duration of the fling animation.


```js
export const BASE_DURATION = 200;
```

We adjust the duration of the animation using the width of the drawer.
There is no physics to this, but we know from testing that the animation starts to feel bad
when the drawer increases in size.
From testing we know that, if we increase the duration as a fraction of the drawer width,
the animation stays smooth across common display sizes.


```js
export const WIDTH_CONTRIBUTION = 0.15;
```

Minimum velocity of the drawer (in px/ms) when releasing to make it fling to opened/closed state.


```js
export const VELOCITY_THRESHOLD = 0.15;
```


