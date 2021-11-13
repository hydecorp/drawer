export declare type CallbackValue = {
    translateX: number;
    opacity: number;
};
export declare class UpdateMixin {
    contentEl: HTMLElement;
    scrimEl: HTMLElement;
    translateX: number;
    side: string;
    opacity: number;
    updater: DOMUpdater;
    updateDOM(translateX: number, drawerWidth: number): void;
}
export declare abstract class DOMUpdater {
    static getUpdaterForPlatform(parent: UpdateMixin): AttributeStyleMapUpdater | StyleUpdater;
    private parent;
    constructor(parent: UpdateMixin);
    get contentEl(): HTMLElement;
    get scrimEl(): HTMLElement;
    abstract updateDOM(translateX: number, opacity: number): void;
}
export declare class StyleUpdater extends DOMUpdater {
    constructor(parent: UpdateMixin);
    updateDOM(translateX: number, opacity: number): void;
}
export declare class AttributeStyleMapUpdater extends DOMUpdater {
    private tvalue;
    private ovalue;
    constructor(parent: UpdateMixin);
    updateDOM(translateX: number, opacity: number): void;
}
//# sourceMappingURL=update.d.ts.map