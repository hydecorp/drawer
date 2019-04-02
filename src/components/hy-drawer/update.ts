import { EventEmitter } from "pencil-runtime";

export type CallbackValue = { translateX: number, opacity: number };

export class UpdateMixin {
  el: HTMLElement;
  contentEl: HTMLElement;
  scrimEl: HTMLElement;

  translateX: number;
  align: string;
  opacity: number;

  updater: Updater;

  move: EventEmitter<CallbackValue>;

  updateDOM(translateX: number, drawerWidth: number) {
    const inv = this.align === "left" ? 1 : -1;
    const opacity = (translateX / drawerWidth) * inv || 0;

    this.translateX = translateX;
    this.opacity = opacity;

    this.move.emit({ translateX, opacity });
    this.updater.updateDOM(translateX, opacity);
  }
}

export abstract class Updater {
  private parent: UpdateMixin;
  constructor(parent: UpdateMixin) {
    this.parent = parent;
  }
  get contentEl() { return this.parent.contentEl }
  get scrimEl() { return this.parent.scrimEl }

  abstract updateDOM(translateX: number, opacity: number): void;
}

export class StyleUpdater extends Updater {
  constructor(parent: UpdateMixin) { super(parent); }

  updateDOM(translateX: number, opacity: number) {
    this.contentEl.style.transform = `translate(${translateX}px, 0px)`;
    this.scrimEl.style.opacity = `${opacity}`;
  }
}

export class AttributeStyleMapUpdater extends Updater {
  // @ts-ignore
  private transformValue: CSSTransformValue;

  constructor(parent: UpdateMixin) {
    super(parent);
    // @ts-ignore
    this.transformValue = new CSSTransformValue([
      // @ts-ignore
      new CSSTranslate(CSS.px(0), CSS.px(0)),
    ]);
  }

  updateDOM(translateX: number, opacity: number) {
    // @ts-ignore
    this.transformValue[0].x = CSS.px(translateX);
    // @ts-ignore
    this.contentEl.attributeStyleMap.set("transform", this.transformValue);
    // @ts-ignore
    this.scrimEl.attributeStyleMap.set("opacity", opacity);
  }
}