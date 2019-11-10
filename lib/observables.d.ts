import { Observable } from "rxjs";
export declare type Coord = {
    target: EventTarget;
    clientX?: number;
    clientY?: number;
    pageX?: number;
    pageY?: number;
    screenX?: number;
    screenY?: number;
    event?: Event;
};
export declare class ObservablesMixin {
    $: {
        mouseEvents?: Observable<boolean>;
        preventDefault?: Observable<boolean>;
    };
    threshold: number;
    noScroll: boolean;
    getStartObservable(): Observable<Coord>;
    getMoveObservable(start$: Observable<Coord>, end$: Observable<Coord>): Observable<Coord>;
    getEndObservable(): Observable<Coord>;
    getIsSlidingObservable(move$: Observable<Coord>, start$: Observable<Coord>, end$: Observable<Coord>): Observable<boolean>;
    getIsSlidingObservableInner(move$: Observable<Coord>, start$: Observable<Coord>): Observable<boolean>;
}
