import { Observable } from "rxjs";
export declare type Coord = {
    readonly target: EventTarget;
    readonly clientX: number;
    readonly clientY: number;
    readonly pageX: number;
    readonly pageY: number;
    readonly screenX: number;
    readonly screenY: number;
    event?: Event;
};
export declare class ObservablesMixin {
    $: {
        mouseEvents: Observable<boolean>;
        preventDefault: Observable<boolean>;
    };
    threshold: number;
    noScroll: boolean;
    getStartObservable(): Observable<Coord>;
    getMoveObservable(start$: Observable<Coord>, end$: Observable<Coord>): Observable<Coord>;
    getEndObservable(): Observable<Coord>;
    getIsSlidingObservable(move$: Observable<Coord>, start$: Observable<Coord>, end$: Observable<Coord>): Observable<boolean | undefined>;
    getIsSlidingObservableInner(move$: Observable<Coord>, start$: Observable<Coord>): Observable<boolean>;
}
//# sourceMappingURL=observables.d.ts.map