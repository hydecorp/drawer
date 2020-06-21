export declare type CallbackValue = {
    translateX: number;
    opacity: number;
};
export declare class UpdateMixin {
    el: HTMLElement;
    contentEl: HTMLElement;
    scrimEl: HTMLElement;
    translateX: number;
    side: string;
    opacity: number;
    updater: Updater;
    updateDOM(translateX: number, drawerWidth: number): void;
}
export declare abstract class Updater {
    static getUpdaterForPlatform(parent: UpdateMixin): AttributeStyleMapUpdater | StyleUpdater;
    private parent;
    constructor(parent: UpdateMixin);
    get contentEl(): HTMLElement;
    get scrimEl(): HTMLElement;
    abstract updateDOM(translateX: number, opacity: number): void;
}
export declare class StyleUpdater extends Updater {
    constructor(parent: UpdateMixin);
    updateDOM(translateX: number, opacity: number): void;
}
export declare class AttributeStyleMapUpdater extends Updater {
    private tvalue;
    private ovalue;
    constructor(parent: UpdateMixin);
    updateDOM(translateX: number, opacity: number): void;
}
