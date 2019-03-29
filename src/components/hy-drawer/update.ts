type CallbackValue = { translateX: number, opacity: number };

export class UpdateMixin {
  el: HTMLElement;
  contentEl: HTMLElement;
  scrimEl: HTMLElement;

  translateX: number;
  align: string;
  opacity: number;

  moveCallback?: (x: CallbackValue) => {};

  updater: Updater;

  // @ts-ignore
  updateDOM(translateX: number, drawerWidth: number) {
    const inv = this.align === "left" ? 1 : -1;
    const opacity = (translateX / drawerWidth) * inv || 0;

    this.translateX = translateX;
    this.opacity = opacity;

    // TODO: revert back to event?
    if (this.moveCallback) this.moveCallback({ translateX, opacity });
    /* this.fireEvent("move", { detail: { translateX, opacity } }); */

    this.updater.updateDOM(translateX, opacity);
  }
}

export abstract class Updater {
  contentEl: HTMLElement;
  scrimEl: HTMLElement;
  constructor(parent: UpdateMixin) {
    this.contentEl = parent.contentEl;
    this.scrimEl = parent.scrimEl;
  }
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