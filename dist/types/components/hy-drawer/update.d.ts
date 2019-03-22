declare type CallbackValue = {
    translateX: number;
    opacity: number;
};
export declare class UpdateMixin {
    el: HTMLElement;
    contentEl: HTMLElement;
    scrimEl: HTMLElement;
    translateX: number;
    align: string;
    opacity: number;
    moveCallback?: (x: CallbackValue) => {};
    updater: Updater;
    updateDOM(translateX: number, drawerWidth: number): void;
}
export declare abstract class Updater {
    contentEl: HTMLElement;
    scrimEl: HTMLElement;
    constructor(parent: UpdateMixin);
    abstract updateDOM(translateX: number, opacity: number): void;
}
export declare class StyleUpdater extends Updater {
    constructor(parent: UpdateMixin);
    updateDOM(translateX: number, opacity: number): void;
}
export declare class AttributeStyleMapUpdater extends Updater {
    transformValue: CSSTransformValue;
    constructor(parent: UpdateMixin);
    updateDOM(translateX: number, opacity: number): void;
}
export {};
