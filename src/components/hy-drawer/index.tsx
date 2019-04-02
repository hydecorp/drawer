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
import { h, Component, Prop, Element, Watch, Method, State, Event, EventEmitter } from 'pencil-runtime';

import { Observable, Subject, BehaviorSubject, combineLatest, merge, NEVER, defer, of } from "rxjs";
import { startWith, takeUntil, map, share, withLatestFrom, tap, sample, timestamp, pairwise, filter, switchMap, skip } from 'rxjs/operators';
import { createTween } from 'rxjs-create-tween';

import { BASE_DURATION, WIDTH_CONTRIBUTION } from './constants';
import { applyMixins, createResizeObservable, filterWhen, easeOutSine } from './common';
import { ObservablesMixin, Coord } from './observables';
import { CalcMixin } from './calc';
import { UpdateMixin, AttributeStyleMapUpdater, StyleUpdater, Updater, CallbackValue } from './update';

@Component({
  tag: 'hy-drawer',
  styleUrl: 'style.css',
  shadow: true,
})
export class HyDrawer implements ObservablesMixin, UpdateMixin, CalcMixin {
  @Element() el: HTMLElement;
  scrimEl: HTMLElement;
  contentEl: HTMLElement;

  @Prop({ type: Boolean, mutable: true, reflectToAttr: true }) opened: boolean = false;
  @Prop({ type: String, mutable: true, reflectToAttr: true }) align: "left" | "right" = "left";
  @Prop({ type: Boolean, mutable: true, reflectToAttr: true }) persistent: boolean = false;
  @Prop({ type: Number, mutable: true, reflectToAttr: true }) threshold: number = 10;
  @Prop({ type: Boolean, mutable: true, reflectToAttr: true }) preventDefault: boolean = false;
  @Prop({ type: Boolean, mutable: true, reflectToAttr: true }) touchEvents: boolean = false;
  @Prop({ type: Boolean, mutable: true, reflectToAttr: true }) mouseEvents: boolean = false;

  @Prop({ type: 'Any', mutable: true }) range: [number, number] = [0, 100];
  @Prop({ type: Number, mutable: true }) translateX: number;
  @Prop({ type: Number, mutable: true }) opacity: number;

  @State() isSliding: boolean = false;
  @State() willChange: boolean = false;

  opened$: Subject<boolean>;
  align$: Subject<"left" | "right">;
  persistent$: Subject<boolean>;
  preventDefault$: Subject<boolean>;
  touchEvents$: Subject<boolean>;
  mouseEvents$: Subject<boolean>;

  @Watch('opened') setOpened(_: boolean) { this.opened$.next(_); }
  @Watch('align') setAlign(_: "left" | "right") { this.align$.next(_); }
  @Watch('persistent') setPersistent(_: boolean) { this.persistent$.next(_); }
  @Watch('preventDefault') setPreventDefault(_: boolean) { this.preventDefault$.next(_); }
  @Watch('touchEvents') setTouchEvents(_: boolean) { this.touchEvents$.next(_); }
  @Watch('mouseEvents') setMouseEvents(_: boolean) { this.mouseEvents$.next(_); }

  @Event() prepare: EventEmitter<void>;
  @Event() slideStart: EventEmitter<boolean>;
  @Event() slideEnd: EventEmitter<boolean>;
  @Event() transitioned: EventEmitter<void>;
  @Event({ bubbles: false }) move: EventEmitter<CallbackValue>;

  animateTo$: Subject<boolean>;

  // ObserablesMixin
  getStartObservable: () => Observable<Coord>;
  getMoveObservable: (start$: Observable<Coord>, end$: Observable<Coord>) => Observable<Coord>;
  getEndObservable: () => Observable<Coord>;
  getIsSlidingObservable: (move$: Observable<Coord>, start$: Observable<Coord>, end$: Observable<Coord>) => Observable<boolean>;
  getIsSlidingObservableInner: (move$: Observable<Coord>, start$: Observable<Coord>) => Observable<boolean>;

  // CalcMixin
  calcIsInRange: (start: Coord, opened: boolean) => boolean;
  calcIsSwipe: (start: Coord, end: Coord, translateX: number, drawerWidth: number, _: number) => boolean;
  calcWillOpen: (start: {}, end: {}, translateX: number, drawerWidth: number, velocity: number) => boolean;
  calcTranslateX: (move: Coord, start: Coord, startTranslateX: number, drawerWidth: number) => number;

  // UpdateMixin
  updateDOM: (translateX: number, drawerWidth: number) => void;
  updater: Updater;

  // HACK: Ugly, ugly hack to enable Hydejack usecase...
  // @Prop({ type: Number, mutable: true }) _peek?: number = 0;

  getDrawerWidth() {
    const resize$ = "ResizeObserver" in window
      ? createResizeObservable(this.contentEl)
      : of({ contentRect: { width: this.contentEl.clientWidth } });

    const drawerWidth$ = resize$.pipe(
      // takeUntil(this.subjects.disconnect),
      map(x => x.contentRect.width),
      // map(x => x - (this._peek || 0)),
      share(),
    );

    return drawerWidth$;
  }

  componentWillLoad() {
    this.opened$ = new BehaviorSubject(this.opened);
    this.align$ = new BehaviorSubject(this.align);
    this.persistent$ = new BehaviorSubject(this.persistent);
    this.preventDefault$ = new BehaviorSubject(this.preventDefault);
    this.touchEvents$ = new BehaviorSubject(this.touchEvents);
    this.mouseEvents$ = new BehaviorSubject(this.mouseEvents);

    this.animateTo$ = new Subject<boolean>();
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

    const start$ = this.getStartObservable().pipe(
      // takeUntil(this.subjects.disconnect),
      filterWhen(active$),
      share(),
    );

    const deferred: {
      translateX$?: Observable<number>
      startTranslateX$?: Observable<number>;
      tweenTranslateX$?: Observable<number>;
    } = {};

    const isScrimVisible$ = defer(() => {
      // console.log('isScrimVisible', this.translateX$);
      return deferred.translateX$.pipe(map(translateX => translateX !== 0))
    });

    const isInRange$ = start$.pipe(
      withLatestFrom(isScrimVisible$),
      map(args => this.calcIsInRange(...args)),
      tap((inRange) => {
        if (inRange) {
          this.willChange = true;
          this.prepare.emit();
        }
      }),
      share(),
    );

    const end$ = this.getEndObservable().pipe(
      // takeUntil(this.subjects.disconnect),
      filterWhen(active$, isInRange$),
      share(),
    );

    const move$ = this.getMoveObservable(start$, end$).pipe(
      // takeUntil(this.subjects.disconnect),
      filterWhen(active$, isInRange$),
      share(),
    );

    const isSliding$ = this.getIsSlidingObservable(move$, start$, end$).pipe(
      tap(isSliding => {
        this.isSliding = isSliding;
        if (isSliding) this.slideStart.emit(this.opened);
      })
    );

    const translateX$ = deferred.translateX$ = defer(() => {
      const jumpTranslateX$ = combineLatest(this.opened$, this.align$, drawerWidth$).pipe(
        tap(() => (this.willChange = false)),
        map(([opened, align, drawerWidth]) => {
          // console.log(drawerWidth);
          return !opened ? 0 : drawerWidth * (align === "left" ? 1 : -1);
        }),
      );

      const moveTranslateX$ = move$.pipe(
        filterWhen(isSliding$),
        tap(({ event }) => this.preventDefault && event.preventDefault()),
        withLatestFrom(start$, deferred.startTranslateX$, drawerWidth$),
        // observeOn(animationFrameScheduler),
        map(args => this.calcTranslateX(...args))
      );

      return merge(deferred.tweenTranslateX$, jumpTranslateX$, moveTranslateX$);
    }).pipe(share());

    deferred.startTranslateX$ = translateX$.pipe(sample(start$));

    const velocity$ = translateX$.pipe(
      timestamp(),
      pairwise(),
      filter(([{ timestamp: prevTime }, { timestamp: time }]) => time - prevTime > 0),
      map(
        ([{ value: prevX, timestamp: prevTime }, { value: x, timestamp: time }]) =>
          (x - prevX) / (time - prevTime)
      ),
      // The initial velocity is zero.
      startWith(0),
    );

    // TODO
    const willOpen$ = end$.pipe(
      tap(() => (this.willChange = false)),
      withLatestFrom(start$, translateX$, drawerWidth$, velocity$),
      filter(args => this.calcIsSwipe(...args)),
      map(args => this.calcWillOpen(...args)),
      // TODO: only fire `slideend` event when slidestart fired as well?
      tap(willOpen => this.slideEnd.emit(willOpen)),
    );

    deferred.tweenTranslateX$ = merge(willOpen$, this.animateTo$).pipe(
      tap(() => (this.willChange = true)),
      // TODO: is there a way to silently set a prop?
      // tap(willOpen => this.opened = willOpen),
      withLatestFrom(translateX$, drawerWidth$),
      switchMap(([opened, translateX, drawerWidth]) => {
        const inv = this.align === "left" ? 1 : -1;
        const endTranslateX = opened ? drawerWidth * inv : 0;
        const diffTranslateX = endTranslateX - translateX;
        const duration = BASE_DURATION + drawerWidth * WIDTH_CONTRIBUTION;

        // console.log('switcham');

        return createTween(easeOutSine, translateX, diffTranslateX, duration).pipe(
          tap({
            complete: () => {
              this.opened = opened;
              this.willChange = false;
              this.transitioned.emit();
            }
          }),
          takeUntil(start$),
          takeUntil(this.align$.pipe(skip(1))),
          share(),
        );
      })
    );

    // console.log(drawerWidth$)

    translateX$
      .pipe(withLatestFrom(drawerWidth$))
      .subscribe(args => {
        // console.log(args);
        this.updateDOM(...args);
      });

    // fromEvent(this.scrimEl, "click")
    //   // .pipe(takeUntil(this.subjects.disconnect))
    //   .subscribe(() => this.close());

    active$.pipe(
      //takeUntil(this.subjects.disconnect)
    ).subscribe(active => {
      this.scrimEl.style.display = active ? "block" : "none";
    });

    this.mouseEvents$.pipe(
      // takeUntil(this.subjects.disconnect),
      switchMap(mouseEvents => {
        return mouseEvents
          ? start$.pipe(withLatestFrom(isInRange$))
          : NEVER;
      }),
      filter(([coord, isInRange]) => isInRange && coord.event != null)
    )
      .subscribe(([{ event }]) => {
        return event.preventDefault();
      });

    /*
    fromEvent(window, "popstate")
      .pipe(
        takeUntil(this.subjects.disconnect),
        subscribeWhen(this.backButton$)
      )
      .subscribe(() => {
        const hash = `#${histId.call(this)}--opened`;
        const willOpen = window.location.hash === hash;
        if (willOpen !== this.opened) this.animateTo$.next(willOpen);
      });
    */


    /*
    if (this._backButton) {
      const hash = `#${histId.call(this)}--opened`;
      if (window.location.hash === hash) this.setInternalState('opened', true);
    }
    */

    //   this.fireEvent("init", { detail: this.opened });
  }

  render() {
    const classList = {
      content: true,
      [this.align]: true,
      grab: this.mouseEvents,
      grabbing: this.mouseEvents && this.isSliding,
    };

    return [
      <div
        class="scrim"
        style={{
          willChange: this.willChange ? 'opacity' : '',
          pointerEvents: this.opened ? 'all' : '',
        }} />,
      <div
        class={classList}
        style={{ willChange: this.willChange ? 'transform' : '' }}
      >
        <div class="overflow">
          <slot></slot>
        </div>
      </div>,
    ];
  }

  @Method()
  open() {
    this.animateTo$.next(true);
  }

  @Method()
  close() {
    this.animateTo$.next(false);
  }

  @Method()
  toggle() {
    this.animateTo$.next(!this.opened);
  }

  static get style() {
    return `
@media screen {
  .scrim {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    opacity: 0;
    pointer-events: none;
    transform: translateX(0);
    -webkit-tap-highlight-color: transparent;

    /* @apply --hy-drawer-scrim-container; */
    background: var(--hy-drawer-scrim-background, rgba(0, 0, 0, 0.5));
    z-index: var(--hy-drawer-scrim-z-index, 20);
  }

  .content {
    position: fixed;
    top: 0;
    height: 100vh;
    transform: translateX(0);
    contain: strict;

    /* @apply --hy-drawer-content-container; */
    width: var(--hy-drawer-width, 300px);
    background: var(--hy-drawer-background, inherit);
    box-shadow: var(--hy-drawer-box-shadow, 0 0 15px rgba(0, 0, 0, 0.25));
    z-index: var(--hy-drawer-z-index, 30);
  }

  .content.left {
    left:  calc(-1 * var(--hy-drawer-slide-width, var(--hy-drawer-width, 300px)));
  }

  .content.right {
    right:  calc(-1 * var(--hy-drawer-slide-width, var(--hy-drawer-width, 300px)));
  }

  .content .overflow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    will-change: scroll-position;
  }

  .grab {
    cursor: move;
    cursor: grab;
  }

  .grabbing {
    cursor: grabbing;
  }
}

@media print {
  .scrim {
    display: none !important;
  }

  .content {
    transform: none !important;
  }
}
    `;
  }
}

applyMixins(HyDrawer, [ObservablesMixin, UpdateMixin, CalcMixin]);