import { css } from 'lit-element';
export const styles = css `
  @media screen {
    :host {
      touch-action: pan-x;
    }

    .full-screen {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
    }

    .full-height {
      position: fixed;
      top: 0;
      height: 100vh;
    }

    .peek {
      left: 0;
      width: var(--hy-drawer-peek-width, 0px);
      visibility: hidden;
      z-index: calc(var(--hy-drawer-z-index, 100) - 1);
    }

    .scrim {
      position: fixed;
      top: 0;
      left: 0;
      height: 10vh;
      width: 10vw;
      transform: scale(10);
      transform-origin: top left;
      opacity: 0;
      pointer-events: none;
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

    .wrapper {
      width: var(--hy-drawer-width, 300px);
      background: var(--hy-drawer-background, inherit);
      box-shadow: var(--hy-drawer-box-shadow, 0 0 15px rgba(0, 0, 0, 0.25));
      z-index: calc(var(--hy-drawer-z-index, 100) + 3);
      contain: strict;
    }

    .wrapper.left {
      left:  calc(-1 * var(--hy-drawer-width, 300px) + var(--hy-drawer-peek-width, 0px));
    }

    .wrapper.right {
      right:  calc(-1 * var(--hy-drawer-width, 300px) + var(--hy-drawer-peek-width, 0px));
    }

    .wrapper > .overflow {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
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

    .wrapper {
      transform: none !important;
    }
  }
`;
//# sourceMappingURL=styles.js.map