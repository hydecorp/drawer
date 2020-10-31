export class UpdateMixin {
    updateDOM(translateX, drawerWidth) {
        const inv = this.side === "left" ? 1 : -1;
        const opacity = (translateX / drawerWidth) * inv || 0;
        this.translateX = translateX;
        this.opacity = opacity;
        this.updater.updateDOM(translateX, opacity);
    }
}
export class Updater {
    constructor(parent) {
        this.parent = parent;
    }
    static getUpdaterForPlatform(parent) {
        const hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && "number" in CSS;
        return hasCSSOM
            ? new AttributeStyleMapUpdater(parent)
            : new StyleUpdater(parent);
    }
    get contentEl() { return this.parent.contentEl; }
    get scrimEl() { return this.parent.scrimEl; }
}
export class StyleUpdater extends Updater {
    constructor(parent) { super(parent); }
    updateDOM(translateX, opacity) {
        this.contentEl.style.transform = `translate(${translateX}px, 0px)`;
        this.scrimEl.style.opacity = `${opacity}`;
    }
}
export class AttributeStyleMapUpdater extends Updater {
    constructor(parent) {
        super(parent);
        // @ts-ignore
        this.tvalue = new CSSTransformValue([new CSSTranslate(CSS.px(0), CSS.px(0))]);
        // @ts-ignore
        this.ovalue = CSS.number(1);
    }
    updateDOM(translateX, opacity) {
        // @ts-ignore
        this.tvalue[0].x.value = translateX;
        // @ts-ignore
        this.ovalue.value = opacity;
        // @ts-ignore
        this.contentEl.attributeStyleMap.set("transform", this.tvalue);
        // @ts-ignore
        this.scrimEl.attributeStyleMap.set("opacity", this.ovalue);
    }
}
//# sourceMappingURL=update.js.map