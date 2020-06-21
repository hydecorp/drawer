var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Copyright (c) 2020 Florian Klampfer <https://qwtel.com/>
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
import { html, property, customElement, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { Subject, BehaviorSubject, combineLatest, merge, NEVER, defer, fromEvent } from "rxjs";
import { startWith, takeUntil, map, share, withLatestFrom, tap, sample, timestamp, pairwise, filter, switchMap, skip, finalize } from 'rxjs/operators';
import { RxLitElement, createResolvablePromise } from '@hydecorp/component';
import { BASE_DURATION, WIDTH_CONTRIBUTION } from './constants';
import { applyMixins, filterWhen, easeOutSine, observeWidth, rangeConverter, rangeHasChanged, tween } from './common';
import { ObservablesMixin } from './observables';
import { CalcMixin } from './calc';
import { UpdateMixin, Updater } from './update';
import { styles } from './styles';
let HyDrawer = class HyDrawer extends applyMixins(RxLitElement, [ObservablesMixin, UpdateMixin, CalcMixin]) {
    constructor() {
        super(...arguments);
        this.el = this;
        this.opened = false;
        this.side = "left";
        this.persistent = false;
        this.threshold = 10;
        this.noScroll = false;
        this.mouseEvents = false;
        // @property({ type: Boolean, reflect: true }) hashChange: boolean = false;
        this.range = [0, 100];
        this.willChange = false;
        this._initialized = createResolvablePromise();
        this.$ = {};
        this.upgrade = () => {
            const drawerWidth$ = this.getDrawerWidth();
            const active$ = this.$.persistent.pipe(map(_ => !_));
            const start$ = this.getStartObservable().pipe(
            // takeUntil(this.subjects.disconnect),
            filterWhen(active$), share());
            const deferred = {};
            const isScrimVisible$ = defer(() => {
                return deferred.translateX$.pipe(map(translateX => translateX !== 0));
            });
            const isInRange$ = start$.pipe(withLatestFrom(isScrimVisible$), map(args => this.calcIsInRange(...args)), tap((inRange) => {
                if (inRange) {
                    this.willChange = true;
                    this.fireEvent('prepare');
                }
            }), share());
            const end$ = this.getEndObservable().pipe(
            // takeUntil(this.subjects.disconnect),
            filterWhen(active$, isInRange$), tap(() => { if (this.mouseEvents)
                this.grabbing = false; }), share());
            const move$ = this.getMoveObservable(start$, end$).pipe(
            // takeUntil(this.subjects.disconnect),
            filterWhen(active$, isInRange$), share());
            const isSliding$ = this.getIsSlidingObservable(move$, start$, end$).pipe(tap(isSliding => {
                this.isSliding = isSliding;
                if (isSliding && this.mouseEvents)
                    this.grabbing = true;
                // if (isSliding) this.fireEvent('slidestart', { detail: this.opened });
            }));
            const translateX$ = deferred.translateX$ = defer(() => {
                const jumpTranslateX$ = combineLatest(this.$.opened, this.$.side, drawerWidth$).pipe(map(([opened, side, drawerWidth]) => {
                    return !opened ? 0 : drawerWidth * (side === "left" ? 1 : -1);
                }));
                const moveTranslateX$ = move$.pipe(filterWhen(isSliding$), tap(() => (this.scrimClickable = false)), tap(({ event }) => this.noScroll && event.preventDefault()), withLatestFrom(start$, deferred.startTranslateX$, drawerWidth$), map(args => this.calcTranslateX(...args)));
                return merge(deferred.tweenTranslateX$, jumpTranslateX$, moveTranslateX$);
            }).pipe(share());
            deferred.startTranslateX$ = translateX$.pipe(sample(start$));
            const velocity$ = translateX$.pipe(timestamp(), pairwise(), filter(([{ timestamp: prevTime }, { timestamp: time }]) => time - prevTime > 0), map(([{ value: prevX, timestamp: prevTime }, { value: x, timestamp: time }]) => (x - prevX) / (time - prevTime)), startWith(0));
            const willOpen$ = end$.pipe(withLatestFrom(start$, translateX$, drawerWidth$, velocity$), filter(args => this.calcIsSwipe(...args)), map(args => this.calcWillOpen(...args)));
            const animateTo$ = this.animateTo$.pipe(tap(() => {
                this.willChange = true;
                this.fireEvent('prepare');
            }));
            deferred.tweenTranslateX$ = merge(willOpen$, animateTo$).pipe(withLatestFrom(translateX$, drawerWidth$), switchMap(([willOpen, translateX, drawerWidth]) => {
                const inv = this.side === "left" ? 1 : -1;
                const endTranslateX = willOpen ? drawerWidth * inv : 0;
                const diffTranslateX = endTranslateX - translateX;
                const duration = Math.ceil(BASE_DURATION + drawerWidth * WIDTH_CONTRIBUTION);
                return tween(easeOutSine, translateX, diffTranslateX, duration).pipe(finalize(() => { this.transitioned(willOpen); }), takeUntil(start$), takeUntil(this.$.side.pipe(skip(1))), share());
            }));
            translateX$.pipe(withLatestFrom(drawerWidth$), tap((args) => {
                this.updateDOM(...args);
                const { translateX, opacity } = this;
                this.fireEvent('move', { detail: { translateX, opacity }, bubbles: false });
            })).subscribe();
            fromEvent(this.scrimEl, "click").pipe(
            // takeUntil(this.subjects.disconnect),
            tap(() => this.close())).subscribe();
            active$.pipe(
            // takeUntil(this.subjects.disconnect),
            tap((active) => {
                this.scrimEl.style.display = active ? "block" : "none";
            })).subscribe();
            this.$.mouseEvents.pipe(
            // takeUntil(this.subjects.disconnect),
            switchMap(mouseEvents => {
                return mouseEvents
                    ? start$.pipe(withLatestFrom(isInRange$))
                    : NEVER;
            }), filter(([coord, isInRange]) => isInRange && coord.event != null), tap(([{ event }]) => event.preventDefault())).subscribe();
            // fromEvent(window, 'hashchange').pipe(
            //   // takeUntil(this.subjects.disconnect),
            //   subscribeWhen(this.$.hashChange),
            //   tap(() => {
            //     const opened = location.hash === this.hashId;
            //     if (!history.state && opened) {
            //       history.replaceState({ [this.histId]: { backable: true } }, document.title)
            //     }
            //     // If the state doesn't match open/close the drawer
            //     if (opened !== this.opened) this.animateTo$.next(opened);
            //   }),
            // ).subscribe();
            this.fireEvent("init", { detail: this.opened });
            this._initialized.resolve(this);
        };
        this.transitioned = (hasOpened) => {
            this.opened = this.scrimClickable = hasOpened;
            this.willChange = false;
            // if (this.hashChange) this.transitionedHash(hasOpened)
            this.fireEvent('transitioned', { detail: hasOpened });
        };
    }
    get initialized() {
        return this._initialized;
    }
    get histId() { return this.id || this.tagName; }
    get hashId() { return `#${this.histId}--opened`; }
    // HyDrawer
    getDrawerWidth() {
        const content$ = observeWidth(this.contentEl)
            .pipe(tap(px => this.fireEvent('content-width-change', { detail: px })));
        const peek$ = observeWidth(this.peekEl)
            .pipe(tap(px => this.fireEvent('peek-width-change', { detail: px })));
        return combineLatest(content$, peek$).pipe(
        // takeUntil(this.subjects.disconnect),
        map(([contentWidth, peekWidth]) => contentWidth - peekWidth), share());
    }
    // private consolidateState() {
    //   const hashOpened = location.hash === this.hashId;
    //   const isReload = history.state && history.state[this.histId];
    //   if (isReload) {
    //     if (hashOpened !== this.opened) {
    //       this.opened = hashOpened;
    //     }
    //   } else {
    //     const url = new URL(location.href);
    //     const newState = { ...history.state, [this.histId]: { backable: false } };
    //     if (hashOpened && !this.opened) {
    //       url.hash = '';
    //       history.replaceState(newState, document.title, url.href);
    //       url.hash = this.hashId;
    //       history.pushState({ [this.histId]: { backable: true } }, document.title, url.href);
    //       this.opened = true;
    //     }
    //     else if (!hashOpened && this.opened) {
    //       history.replaceState(newState, document.title, url.href);
    //       url.hash = this.hashId;
    //       history.pushState({ [this.histId]: { backable: true } }, document.title, url.href);
    //     }
    //     else {
    //       history.replaceState(newState, document.title, url.href);
    //     }
    //   }
    // }
    connectedCallback() {
        super.connectedCallback();
        // if (this.hashChange) this.consolidateState()
        this.$.opened = new BehaviorSubject(this.opened);
        this.$.side = new BehaviorSubject(this.side);
        this.$.persistent = new BehaviorSubject(this.persistent);
        this.$.preventDefault = new BehaviorSubject(this.noScroll);
        this.$.mouseEvents = new BehaviorSubject(this.mouseEvents);
        // this.$.hashChange = new BehaviorSubject(this.hashChange)
        this.scrimClickable = this.opened;
        this.animateTo$ = new Subject();
        this.updater = Updater.getUpdaterForPlatform(this);
        this.updateComplete.then(this.upgrade);
    }
    // private transitionedHash(hasOpened: boolean) {
    //   const hasClosed = !hasOpened;
    //   const { backable } = history.state && history.state[this.histId] || { backable: false }
    //   if (hasClosed && backable) {
    //     history.back()
    //   } 
    //   if (hasOpened && location.hash !== this.hashId) {
    //     location.hash = this.hashId;
    //   }
    // }
    render() {
        return html `
      <div class="peek full-height"></div>
      <div
        class="scrim"
        style=${styleMap({
            willChange: this.willChange ? 'opacity' : '',
            pointerEvents: this.scrimClickable ? 'all' : '',
        })}>
      </div>
      ${this.mouseEvents && this.grabbing && !this.scrimClickable
            ? html `<div class="grabbing-screen full-screen"></div>`
            : null}
      <div
        class=${classMap({
            wrapper: true,
            'full-height': true,
            [this.side]: true,
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
    open() {
        this.animateTo$.next(true);
    }
    close() {
        this.animateTo$.next(false);
    }
    toggle() {
        this.animateTo$.next(!this.opened);
    }
};
HyDrawer.styles = styles;
__decorate([
    query('.scrim')
], HyDrawer.prototype, "scrimEl", void 0);
__decorate([
    query('.wrapper')
], HyDrawer.prototype, "contentEl", void 0);
__decorate([
    query('.peek')
], HyDrawer.prototype, "peekEl", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], HyDrawer.prototype, "opened", void 0);
__decorate([
    property({ type: String, reflect: true })
], HyDrawer.prototype, "side", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], HyDrawer.prototype, "persistent", void 0);
__decorate([
    property({ type: Number, reflect: true })
], HyDrawer.prototype, "threshold", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], HyDrawer.prototype, "noScroll", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], HyDrawer.prototype, "mouseEvents", void 0);
__decorate([
    property({ reflect: true, converter: rangeConverter, hasChanged: rangeHasChanged })
], HyDrawer.prototype, "range", void 0);
__decorate([
    property()
], HyDrawer.prototype, "scrimClickable", void 0);
__decorate([
    property()
], HyDrawer.prototype, "grabbing", void 0);
__decorate([
    property()
], HyDrawer.prototype, "willChange", void 0);
__decorate([
    property()
], HyDrawer.prototype, "open", null);
__decorate([
    property()
], HyDrawer.prototype, "close", null);
__decorate([
    property()
], HyDrawer.prototype, "toggle", null);
HyDrawer = __decorate([
    customElement('hy-drawer')
], HyDrawer);
export { HyDrawer };
//# sourceMappingURL=index.js.map