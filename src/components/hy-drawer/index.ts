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
import { LitElement, html, css, property, customElement, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';

import { Observable, Subject, BehaviorSubject, combineLatest, merge, NEVER, defer, of, fromEvent } from "rxjs";
import { startWith, takeUntil, map, share, withLatestFrom, tap, sample, timestamp, pairwise, filter, switchMap, skip } from 'rxjs/operators';
import { createTween } from 'rxjs-create-tween';

import { BASE_DURATION, WIDTH_CONTRIBUTION } from './constants';
import { applyMixins, createResizeObservable, filterWhen, easeOutSine } from './common';
import { ObservablesMixin, Coord } from './observables';
import { CalcMixin } from './calc';
import { UpdateMixin, Updater } from './update';

class RxLitElement extends LitElement {
  $connected = new Subject<boolean>();
  connectedCallback() { 
    super.connectedCallback()
    this.$connected.next(true) 
  }
  disconnectedCallback() { 
    super.disconnectedCallback()
    this.$connected.next(false) 
  }

  private firstUpdate: boolean
  $: {}

  firstUpdated() {
    this.firstUpdate = true
  }

  updated(changedProperties: Map<string, any>) {
    if (!this.firstUpdate) for (const prop of changedProperties.keys()) {
      if (prop in this.$) this.$[prop].next(this[prop]);
    }
    this.firstUpdate = false
  }
}

@customElement('hy-drawer')
export class HyDrawer 
    extends applyMixins(RxLitElement, [ObservablesMixin, UpdateMixin, CalcMixin])
    implements ObservablesMixin, UpdateMixin, CalcMixin {

  el: HTMLElement = this

  @query('.scrim') scrimEl: HTMLElement;
  @query('.content') contentEl: HTMLElement;

  @property({ type: Boolean, reflect: true }) opened: boolean = false;
  @property({ type: String, reflect: true }) align: "left" | "right" = "left";
  @property({ type: Boolean, reflect: true }) persistent: boolean = false;
  @property({ type: Number, reflect: true }) threshold: number = 10;
  @property({ type: Boolean, reflect: true, attribute: 'prevent-default' }) preventDefault: boolean = false;
  @property({ type: Boolean, reflect: true, attribute: 'mouse-events' }) mouseEvents: boolean = false;
  @property({ type: Array, reflect: true }) range: [number, number] = [0, 100];

  @property() scrimClickable: boolean
  @property() grabbing: boolean

  get histId() { return this.id || this.tagName}
  get hashId() { return `#${this.histId}--opened` }

  translateX: number;
  opacity: number;

  isSliding: boolean = false;
  willChange: boolean = false;

  $: {
    opened?: Subject<boolean>;
    align?: Subject<"left" | "right">;
    persistent?: Subject<boolean>;
    preventDefault?: Subject<boolean>;
    mouseEvents?: Subject<boolean>;
  } = {}

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
  _peek$?: Observable<number>;

  getDrawerWidth() {
    const resize$ = "ResizeObserver" in window
      ? createResizeObservable(this.contentEl)
      : of({ contentRect: { width: this.contentEl.clientWidth } });

    const drawerWidth$ = resize$.pipe(
      // takeUntil(this.subjects.disconnect),
      map(x => x.contentRect.width),
      share(),
    );

    if (this._peek$) {
      return combineLatest(drawerWidth$, this._peek$).pipe(
        map(([drawerWidth, peek]) => drawerWidth - peek)
      );
    }

    return drawerWidth$;
  }

  consolidateState() {
    const hashOpened = location.hash === this.hashId;
    const isReload = history.state && history.state[this.histId];
    if (isReload) {
      if (hashOpened !== this.opened) {
        this.opened = hashOpened;
      }
    } else {
      if (hashOpened && !this.opened) {
        const url = new URL(location.href);
        url.hash = '';
        history.replaceState({ [this.histId]: { backable: false } }, document.title, url.href);
        url.hash = this.hashId;
        history.pushState({ [this.histId]: { backable: true } }, document.title, url.href);
        this.opened = true;
      }
      if (!hashOpened && this.opened) {
        const url = new URL(location.href);
        url.hash = this.hashId;
        history.pushState({ [this.histId]: { backable: true } }, document.title, url.href);
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.consolidateState()

    this.$.opened = new BehaviorSubject(this.opened);
    this.$.align = new BehaviorSubject(this.align);
    this.$.persistent = new BehaviorSubject(this.persistent);
    this.$.preventDefault = new BehaviorSubject(this.preventDefault);
    this.$.mouseEvents = new BehaviorSubject(this.mouseEvents);

    this.scrimClickable = this.opened

    this.animateTo$ = new Subject<boolean>();

    this.updater = Updater.getUpdaterForPlatform(this);

    this.updateComplete.then(this.upgrade);
  }

  upgrade = () => {
    const drawerWidth$ = this.getDrawerWidth();
    const active$ = this.$.persistent.pipe(map(_ => !_));

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
      return deferred.translateX$.pipe(map(translateX => translateX !== 0))
    });

    const isInRange$ = start$.pipe(
      withLatestFrom(isScrimVisible$),
      map(args => this.calcIsInRange(...args)),
      tap((inRange) => {
        if (inRange) {
          this.willChange = true;
          this.dispatchEvent(new CustomEvent('prepare'))
        }
      }),
      share(),
    );

    const end$ = this.getEndObservable().pipe(
      // takeUntil(this.subjects.disconnect),
      filterWhen(active$, isInRange$),
      tap(() => { if (this.mouseEvents) this.grabbing = false; }),
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
        if (isSliding && this.mouseEvents) this.grabbing = true;
        // if (isSliding) this.dispatchEvent(new CustomEvent('slidestart', { detail: this.opened }));
      })
    );

    const translateX$ = deferred.translateX$ = defer(() => {
      const jumpTranslateX$ = combineLatest(this.$.opened, this.$.align, drawerWidth$).pipe(
        tap(() => (this.willChange = false)),
        map(([opened, align, drawerWidth]) => {
          return !opened ? 0 : drawerWidth * (align === "left" ? 1 : -1);
        }),
      );

      const moveTranslateX$ = move$.pipe(
        filterWhen(isSliding$),
        tap(() => (this.scrimClickable = false)),
        tap(({ event }) => this.preventDefault && event.preventDefault()),
        withLatestFrom(start$, deferred.startTranslateX$, drawerWidth$),
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
      // tap(willOpen => this.dispatchEvent(new CustomEvent('slideend', { detail: willOpen }))),
    );

    deferred.tweenTranslateX$ = merge(willOpen$, this.animateTo$).pipe(
      tap(() => (this.willChange = true)),
      // TODO: is there a way to silently set a prop?
      // tap(willOpen => this.opened = willOpen),
      withLatestFrom(translateX$, drawerWidth$),
      switchMap(([willOpen, translateX, drawerWidth]) => {
        const inv = this.align === "left" ? 1 : -1;
        const endTranslateX = willOpen ? drawerWidth * inv : 0;
        const diffTranslateX = endTranslateX - translateX;
        const duration = BASE_DURATION + drawerWidth * WIDTH_CONTRIBUTION;

        return createTween(easeOutSine, translateX, diffTranslateX, duration).pipe(
          tap({ complete: () => this.transitioned(willOpen) }),
          takeUntil(start$),
          takeUntil(this.$.align.pipe(skip(1))),
          share(),
        );
      })
    );

    translateX$
      .pipe(withLatestFrom(drawerWidth$))
      .subscribe(args => {
        this.updateDOM(...args);
      });

    fromEvent(this.scrimEl, "click")
      // .pipe(takeUntil(this.subjects.disconnect))
      .subscribe(() => this.close());

    active$.pipe(
      //takeUntil(this.subjects.disconnect)
    ).subscribe(active => {
      this.scrimEl.style.display = active ? "block" : "none";
    });

    this.$.mouseEvents.pipe(
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

    fromEvent(window, 'hashchange')
      .subscribe((e) => {
        const opened = location.hash === this.hashId;

        if (!history.state && opened) {
          // added a new state to the history
          // if the location hash matches this components hash,
          // add the component now that we can call `history.back`.
          history.replaceState({ [this.histId]: { backable: true } }, document.title, )
        }

        // If the state doesn't match open/close the drawer
        this.animateTo$.next(opened);
      })

    this.dispatchEvent(new CustomEvent("init", { detail: this.opened }));
  }

  private transitioned = (hasOpened: boolean) => {
    const hasClosed = !hasOpened;

    this.opened = this.scrimClickable = hasOpened;
    this.willChange = false;

    const { backable } = history.state && history.state[this.histId] || { backable: false }
    if (hasClosed && backable) {
      history.back()
    } 
    if (hasOpened && location.hash !== this.hashId) {
      location.hash = this.hashId;
    }

    this.dispatchEvent(new CustomEvent('transitioned', { detail: hasOpened }))
  }

  render() {
    // const [start, end] = this.range
    // ${this.mouseEvents ? html`<div class="range grab" style=${styleMap({ 
    //   [this.align]: `${start}px`,
    //   width: `${end - start}px`
    // })}></div>` : null}

    return html`
      <div
        class="screen scrim"
        style=${styleMap({
          willChange: this.willChange ? 'opacity' : '',
          pointerEvents: this.scrimClickable ? 'all' : '',
        })}>
      </div>
      ${this.mouseEvents && this.grabbing && !this.scrimClickable 
        ? html`<div class="screen grabbing-screen"></div>` 
        : null}
      <div
        class=${classMap({
          content: true,
          [this.align]: true,
          grab: this.mouseEvents,
          grabbing: this.mouseEvents && this.grabbing,
        })}
        style=${styleMap({ 
          willChange: this.willChange ? 'transform' : '',
        })}
      >
        <div class="overflow">
          <slot></slot>
        </div>
      </div>
    `;
  }

  @property()
  open() {
    this.animateTo$.next(true);
  }

  @property()
  close() {
    this.animateTo$.next(false);
  }

  @property()
  toggle() {
    this.animateTo$.next(!this.opened);
  }

  static styles = css`
    @media screen {
      :host {
        touch-action: pan-x;
      }

      .screen {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
      }

      .scrim {
        opacity: 0;
        pointer-events: none;
        transform: translateX(0);
        background: var(--hy-drawer-scrim-background, rgba(0, 0, 0, 0.5));
        z-index: var(--hy-drawer-z-index, 100);
        -webkit-tap-highlight-color: transparent;
      }

      .range {
        position: fixed;
        top: 0;
        height: 100vh;
        z-index: calc(var(--hy-drawer-z-index, 100) + 1);
      }

      .grabbing-screen {
        cursor: grabbing;
        z-index: calc(var(--hy-drawer-z-index, 100) + 2);
      }

      .content {
        position: fixed;
        top: 0;
        height: 100vh;
        transform: translateX(0);
        contain: strict;

        width: var(--hy-drawer-width, 300px);
        background: var(--hy-drawer-background, inherit);
        box-shadow: var(--hy-drawer-box-shadow, 0 0 15px rgba(0, 0, 0, 0.25));
        z-index: calc(var(--hy-drawer-z-index, 100) + 3);
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
        will-change: scroll-position;
        -webkit-overflow-scrolling: touch;
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
