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
import { LitElement } from 'lit-element';
import { Observable, Subject } from "rxjs";
import { ObservablesMixin, Coord } from './observables';
import { CalcMixin } from './calc';
import { UpdateMixin, Updater } from './update';
declare class RxLitElement extends LitElement {
    $connected: Subject<boolean>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private firstUpdate;
    $: {};
    firstUpdated(): void;
    updated(changedProperties: Map<string, any>): void;
}
declare const HyDrawer_base: Constructor<RxLitElement>;
export declare class HyDrawer extends HyDrawer_base implements ObservablesMixin, UpdateMixin, CalcMixin {
    static styles: import("lit-element").CSSResult;
    el: HTMLElement;
    scrimEl: HTMLElement;
    contentEl: HTMLElement;
    peekEl: HTMLElement;
    opened: boolean;
    side: "left" | "right";
    persistent: boolean;
    threshold: number;
    noScroll: boolean;
    mouseEvents: boolean;
    range: [number, number];
    scrimClickable: boolean;
    grabbing: boolean;
    willChange: boolean;
    readonly histId: string;
    readonly hashId: string;
    translateX: number;
    opacity: number;
    isSliding: boolean;
    $: {
        opened?: Subject<boolean>;
        side?: Subject<"left" | "right">;
        persistent?: Subject<boolean>;
        preventDefault?: Subject<boolean>;
        mouseEvents?: Subject<boolean>;
    };
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
    getDrawerWidth(): Observable<number>;
    consolidateState(): void;
    connectedCallback(): void;
    upgrade: () => void;
    private transitioned;
    render(): import("lit-element").TemplateResult;
    open(): void;
    close(): void;
    toggle(): void;
}
export {};
