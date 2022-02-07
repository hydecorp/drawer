import { Observable, Subject } from "rxjs";
import { RxLitElement } from '@hydecorp/component';
import { ObservablesMixin, Coord } from './observables';
import { CalcMixin } from './calc';
import { UpdateMixin, DOMUpdater } from './update';
declare const HyDrawer_base: Constructor<RxLitElement>;
export declare class HyDrawer extends HyDrawer_base implements ObservablesMixin, UpdateMixin, CalcMixin {
    #private;
    static styles: import("lit-element").CSSResult;
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
    get initialized(): Promise<unknown> & {
        resolve: (value: unknown) => void;
        reject: (reason?: any) => void;
    };
    translateX: number;
    opacity: number;
    isSliding: boolean;
    $: {
        opened: Subject<boolean>;
        side: Subject<"left" | "right">;
        persistent: Subject<boolean>;
        preventDefault: Subject<boolean>;
        mouseEvents: Subject<boolean>;
    };
    animateTo$: Subject<boolean>;
    getStartObservable: () => Observable<Coord>;
    getMoveObservable: (start: Observable<Coord>, end: Observable<Coord>) => Observable<Coord>;
    getEndObservable: () => Observable<Coord>;
    getIsSlidingObservable: (move: Observable<Coord>, start: Observable<Coord>, end: Observable<Coord>) => Observable<boolean>;
    getIsSlidingObservableInner: (move: Observable<Coord>, start: Observable<Coord>) => Observable<boolean>;
    calcIsInRange: (start: Coord, opened: boolean) => boolean;
    calcIsSwipe: (start: Coord, end: Coord, translateX: number, drawerWidth: number, _: number) => boolean;
    calcWillOpen: (start: {}, end: {}, translateX: number, drawerWidth: number, velocity: number) => boolean;
    calcTranslateX: (move: Coord, start: Coord, startTranslateX: number, drawerWidth: number) => number;
    updateDOM: (translateX: number, drawerWidth: number) => void;
    updater: DOMUpdater;
    getDrawerWidth(): Observable<number>;
    connectedCallback(): void;
    upgrade: () => void;
    private transitioned;
    render(): import("lit-element").TemplateResult;
    open(): void;
    close(): void;
    toggle(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map