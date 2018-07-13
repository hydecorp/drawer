// # src / mixin / operators.js
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

import { NEVER } from "rxjs/_esm5";

import { filter, map, switchMap, withLatestFrom } from "rxjs/_esm5/operators";

// ### Observable extensions
// #### Subscribe when
// This operator is like `filterWhen`, but it will unsubscribe from the source observable
// when the input observable emits `false`, and re-subscribe when it emits `true`.
export const subscribeWhen = p$ => source => {
  if (process.env.DEBUG && !p$) throw Error();
  return p$.pipe(switchMap(p => (p ? source : NEVER)));
};

// #### Filter when
// This operator is like `filter`, but it takes an observable of booleans as input,
// instead of a predicate function.
export const filterWhen = (p$, ...others) => source => {
  if (process.env.DEBUG && !p$) throw Error();
  else if (others.length === 0) {
    return source.pipe(
      withLatestFrom(p$),
      filter(([, p]) => p),
      map(([x]) => x)
    );

    // When providing more than one observable, the result observable will only emit values
    // when `every` input observable has emitted a truthy value.
  } else {
    return source.pipe(
      withLatestFrom(p$, ...others),
      filter(([, ...ps]) => ps.every(p => p)),
      map(([x]) => x)
    );
  }
};
