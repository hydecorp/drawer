import '../../stencil.core';
/**
 * Copyright (c) 2019 Florian Klampfer <https://qwtel.com/>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license
 * @nocompile
 */
import { EventEmitter } from '../../stencil.core';
import { Observable, Subject } from "rxjs";
import { ObservablesMixin, Coord } from './observables';
import { CalcMixin } from './calc';
import { UpdateMixin, Updater } from './update';
export declare class HyDrawer implements ObservablesMixin, UpdateMixin, CalcMixin {
    el: HTMLElement;
    scrimEl: HTMLElement;
    contentEl: HTMLElement;
    opened: boolean;
    align: "left" | "right";
    persistent: boolean;
    threshold: number;
    preventDefault: boolean;
    touchEvents: boolean;
    mouseEvents: boolean;
    range: [number, number];
    translateX: number;
    opacity: number;
    isSliding: boolean;
    willChange: boolean;
    opened$: Subject<boolean>;
    align$: Subject<"left" | "right">;
    persistent$: Subject<boolean>;
    preventDefault$: Subject<boolean>;
    touchEvents$: Subject<boolean>;
    mouseEvents$: Subject<boolean>;
    setOpened(_: boolean): void;
    setAlign(_: "left" | "right"): void;
    setPersistent(_: boolean): void;
    setPreventDefault(_: boolean): void;
    setTouchEvents(_: boolean): void;
    setMouseEvents(_: boolean): void;
    slideStart: EventEmitter<boolean>;
    slideEnd: EventEmitter<boolean>;
    animateTo$: Subject<boolean>;
    getStartObservable: () => Observable<Coord>;
    getMoveObservable: (start$: Observable<Coord>, end$: Observable<Coord>) => Observable<Coord>;
    getEndObservable: () => Observable<Coord>;
    getIsSlidingObservable: (move$: Observable<Coord>, start$: Observable<Coord>, end$: Observable<Coord>) => Observable<boolean>;
    getIsSlidingObservableInner: (move$: Observable<Coord>, start$: Observable<Coord>) => Observable<boolean>;
    calcIsInRange: (start: Coord, opened: boolean) => boolean;
    calcIsSwipe: (start: Coord, end: Coord, translateX: number, drawerWidth: number, _: number) => boolean;
    calcWillOpen: (start: {}, end: {}, translateX: number, drawerWidth: number, velocity: number) => boolean;
    calcTranslateX: (move: Coord, start: Coord, startTranslateX: number, drawerWidth: number) => number;
    updateDOM: (translateX: number, drawerWidth: number) => void;
    updater: Updater;
    _peek$?: Observable<number>;
    getDrawerWidth(): Observable<number>;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element[];
    open(): void;
    close(): void;
    toggle(): void;
}
