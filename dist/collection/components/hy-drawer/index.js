import { Subject, BehaviorSubject, combineLatest, merge, NEVER, defer, of } from "rxjs";
import { startWith, takeUntil, map, share, withLatestFrom, tap, sample, timestamp, pairwise, filter, switchMap, skip } from 'rxjs/operators';
import { createTween } from 'rxjs-create-tween';
import { BASE_DURATION, WIDTH_CONTRIBUTION } from './constants';
import { applyMixins, createResizeObservable, filterWhen, easeOutSine } from './common';
import { ObservablesMixin } from './observables';
import { CalcMixin } from './calc';
import { UpdateMixin, AttributeStyleMapUpdater, StyleUpdater } from './update';
export class HyDrawer {
    constructor() {
        this.opened = false;
        this.align = "left";
        this.persistent = false;
        this.threshold = 10;
        this.preventDefault = false;
        this.touchEvents = false;
        this.mouseEvents = false;
        this.range = [0, 100];
        this.isSliding = false;
        this.willChange = false;
    }
    setOpened(_) { this.opened$.next(_); }
    setAlign(_) { this.align$.next(_); }
    setPersistent(_) { this.persistent$.next(_); }
    setPreventDefault(_) { this.preventDefault$.next(_); }
    setTouchEvents(_) { this.touchEvents$.next(_); }
    setMouseEvents(_) { this.mouseEvents$.next(_); }
    getDrawerWidth() {
        const resize$ = "ResizeObserver" in window
            ? createResizeObservable(this.contentEl)
            : of({ contentRect: { width: this.contentEl.clientWidth } });
        const drawerWidth$ = resize$.pipe(map((x) => x.contentRect.width), share());
        if (this._peek$) {
            return combineLatest(drawerWidth$, this._peek$).pipe(map(([drawerWidth, peek]) => drawerWidth - peek));
        }
        return drawerWidth$;
    }
    componentWillLoad() {
        this.opened$ = new BehaviorSubject(this.opened);
        this.align$ = new BehaviorSubject(this.align);
        this.persistent$ = new BehaviorSubject(this.persistent);
        this.preventDefault$ = new BehaviorSubject(this.preventDefault);
        this.touchEvents$ = new BehaviorSubject(this.touchEvents);
        this.mouseEvents$ = new BehaviorSubject(this.mouseEvents);
        this.animateTo$ = new Subject();
    }
    componentDidLoad() {
        this.scrimEl = this.el.shadowRoot.querySelector('.scrim');
        this.contentEl = this.el.shadowRoot.querySelector('.content');
        const hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && "number" in CSS;
        this.updater = hasCSSOM
            ? new AttributeStyleMapUpdater(this)
            : new StyleUpdater(this);
        const drawerWidth$ = this.getDrawerWidth();
        const active$ = this.persistent$.pipe(map(_ => !_));
        const start$ = this.getStartObservable().pipe(filterWhen(active$), share());
        const deferred = {};
        const isScrimVisible$ = defer(() => {
            return deferred.translateX$.pipe(map(translateX => translateX !== 0));
        });
        const isInRange$ = start$.pipe(withLatestFrom(isScrimVisible$), map(args => this.calcIsInRange(...args)), tap((inRange) => {
            if (inRange)
                this.willChange = true;
        }), share());
        const end$ = this.getEndObservable().pipe(filterWhen(active$, isInRange$), share());
        const move$ = this.getMoveObservable(start$, end$).pipe(filterWhen(active$, isInRange$), share());
        const isSliding$ = this.getIsSlidingObservable(move$, start$, end$).pipe(tap(isSliding => {
            this.isSliding = isSliding;
            if (isSliding)
                this.slideStart.emit(this.opened);
        }));
        const translateX$ = deferred.translateX$ = defer(() => {
            const jumpTranslateX$ = combineLatest(this.opened$, this.align$, drawerWidth$).pipe(tap(() => (this.willChange = false)), map(([opened, align, drawerWidth]) => {
                console.log(drawerWidth);
                return !opened ? 0 : drawerWidth * (align === "left" ? 1 : -1);
            }));
            const moveTranslateX$ = move$.pipe(filterWhen(isSliding$), tap(({ event }) => this.preventDefault && event.preventDefault()), withLatestFrom(start$, deferred.startTranslateX$, drawerWidth$), map(args => this.calcTranslateX(...args)));
            return merge(deferred.tweenTranslateX$, jumpTranslateX$, moveTranslateX$);
        }).pipe(share());
        deferred.startTranslateX$ = translateX$.pipe(sample(start$));
        const velocity$ = translateX$.pipe(timestamp(), pairwise(), filter(([{ timestamp: prevTime }, { timestamp: time }]) => time - prevTime > 0), map(([{ value: prevX, timestamp: prevTime }, { value: x, timestamp: time }]) => (x - prevX) / (time - prevTime)), startWith(0));
        const willOpen$ = end$.pipe(tap(() => (this.willChange = false)), withLatestFrom(start$, translateX$, drawerWidth$, velocity$), filter(args => this.calcIsSwipe(...args)), map(args => this.calcWillOpen(...args)), tap(willOpen => this.slideEnd.emit(willOpen)));
        deferred.tweenTranslateX$ = merge(willOpen$, this.animateTo$).pipe(tap(() => (this.willChange = true)), withLatestFrom(translateX$, drawerWidth$), switchMap(([opened, translateX, drawerWidth]) => {
            const inv = this.align === "left" ? 1 : -1;
            const endTranslateX = opened ? drawerWidth * inv : 0;
            const diffTranslateX = endTranslateX - translateX;
            const duration = BASE_DURATION + drawerWidth * WIDTH_CONTRIBUTION;
            return createTween(easeOutSine, translateX, diffTranslateX, duration).pipe(tap({ complete: () => (this.opened = opened, this.willChange = false) }), takeUntil(start$), takeUntil(this.align$.pipe(skip(1))), share());
        }));
        translateX$
            .pipe(withLatestFrom(drawerWidth$))
            .subscribe(args => {
            this.updateDOM(...args);
        });
        active$.pipe().subscribe(active => {
            this.scrimEl.style.display = active ? "block" : "none";
        });
        this.mouseEvents$.pipe(switchMap(mouseEvents => {
            return mouseEvents
                ? start$.pipe(withLatestFrom(isInRange$))
                : NEVER;
        }), filter(([coord, isInRange]) => isInRange && coord.event != null))
            .subscribe(([{ event }]) => {
            return event.preventDefault();
        });
    }
    render() {
        const classList = {
            content: true,
            [this.align]: true,
            grab: this.mouseEvents,
            grabbing: this.mouseEvents && this.isSliding,
        };
        return [
            h("div", { class: "scrim", style: {
                    willChange: this.willChange ? 'opacity' : '',
                    pointerEvents: this.opened ? 'all' : '',
                } }),
            h("div", { class: classList, style: { willChange: this.willChange ? 'transform' : '' } },
                h("div", { class: "overflow" },
                    h("slot", null))),
        ];
    }
    open() {
        this.animateTo$.next(true);
    }
    close() {
        this.animateTo$.next(false);
    }
    toggle() {
        this.animateTo$.next(!this.opened);
    }
    static get is() { return "hy-drawer"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "align": {
            "type": String,
            "attr": "align",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setAlign"]
        },
        "close": {
            "method": true
        },
        "el": {
            "elementRef": true
        },
        "isSliding": {
            "state": true
        },
        "mouseEvents": {
            "type": Boolean,
            "attr": "mouse-events",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setMouseEvents"]
        },
        "opacity": {
            "type": Number,
            "attr": "opacity",
            "mutable": true
        },
        "open": {
            "method": true
        },
        "opened": {
            "type": Boolean,
            "attr": "opened",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setOpened"]
        },
        "persistent": {
            "type": Boolean,
            "attr": "persistent",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setPersistent"]
        },
        "preventDefault": {
            "type": Boolean,
            "attr": "prevent-default",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setPreventDefault"]
        },
        "range": {
            "type": "Any",
            "attr": "range",
            "mutable": true
        },
        "threshold": {
            "type": Number,
            "attr": "threshold",
            "reflectToAttr": true,
            "mutable": true
        },
        "toggle": {
            "method": true
        },
        "touchEvents": {
            "type": Boolean,
            "attr": "touch-events",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setTouchEvents"]
        },
        "translateX": {
            "type": Number,
            "attr": "translate-x",
            "mutable": true
        },
        "willChange": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "slideStart",
            "method": "slideStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "slideEnd",
            "method": "slideEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:hy-drawer:**/"; }
}
applyMixins(HyDrawer, [ObservablesMixin, UpdateMixin, CalcMixin]);
