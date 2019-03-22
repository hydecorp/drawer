export class UpdateMixin {
    updateDOM(translateX, drawerWidth) {
        const inv = this.align === "left" ? 1 : -1;
        const opacity = (translateX / drawerWidth) * inv || 0;
        this.translateX = translateX;
        this.opacity = opacity;
        if (this.moveCallback)
            this.moveCallback({ translateX, opacity });
        this.updater.updateDOM(translateX, opacity);
    }
}
export class Updater {
    constructor(parent) {
        this.contentEl = parent.contentEl;
        this.scrimEl = parent.scrimEl;
    }
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
        this.transformValue = new CSSTransformValue([
            new CSSTranslate(CSS.px(0), CSS.px(0)),
        ]);
    }
    updateDOM(translateX, opacity) {
        this.transformValue[0].x = CSS.px(translateX);
        this.contentEl.attributeStyleMap.set("transform", this.transformValue);
        this.scrimEl.attributeStyleMap.set("opacity", opacity);
    }
}
