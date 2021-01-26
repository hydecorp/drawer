export type CallbackValue = { translateX: number, opacity: number };

export class UpdateMixin {
  contentEl!: HTMLElement;
  scrimEl!: HTMLElement;

  translateX!: number;
  side!: string;
  opacity!: number;

  updater!: DOMUpdater;

  updateDOM(translateX: number, drawerWidth: number) {
    const inv = this.side === "left" ? 1 : -1;
    const opacity = (translateX / drawerWidth) * inv || 0;

    this.translateX = translateX;
    this.opacity = opacity;

    this.updater.updateDOM(translateX, opacity);
  }
}

export abstract class DOMUpdater {
  static getUpdaterForPlatform(parent: UpdateMixin) {
    const hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && "number" in CSS;
    return hasCSSOM
      ? new AttributeStyleMapUpdater(parent)
      : new StyleUpdater(parent);
  }

  private parent: UpdateMixin;
  constructor(parent: UpdateMixin) {
    this.parent = parent;
  }
  get contentEl() { return this.parent.contentEl }
  get scrimEl() { return this.parent.scrimEl }

  abstract updateDOM(translateX: number, opacity: number): void;
}

export class StyleUpdater extends DOMUpdater {
  constructor(parent: UpdateMixin) { super(parent); }

  updateDOM(translateX: number, opacity: number) {
    this.contentEl.style.transform = `translate(${translateX}px, 0px)`;
    this.scrimEl.style.opacity = `${opacity}`;
  }
}

export class AttributeStyleMapUpdater extends DOMUpdater {
  private tvalue: CSSTransformValue;
  private ovalue: CSSUnitValue;

  constructor(parent: UpdateMixin) {
    super(parent);
    this.tvalue = new CSSTransformValue([new CSSTranslate(CSS.px(0), CSS.px(0))]);
    this.ovalue = CSS.number(1);
  }

  updateDOM(translateX: number, opacity: number) {
    ((this.tvalue[0] as CSSTranslate).x as CSSUnitValue).value = translateX;
    this.ovalue.value = opacity;

    this.contentEl.attributeStyleMap.set("transform", this.tvalue);
    this.scrimEl.attributeStyleMap.set("opacity", this.ovalue);
  }
}