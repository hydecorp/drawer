# src / mixin / update.js
Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


```js

const hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && CSS.number;

export const updateMixin = C =>
  class extends C {
    histId() {
      return this.el.id || this.constructor.componentName;
    }
```

#### Prepare and cleanup interaction
`prepareInteraction` causes various side effects before sliding the drawer.

Note that the drawer receives the `hy-drawer-opened` CSS class when it is opened.
This class makes the drawer appear open by setting the CSS `left` (`right`) property, instead
of an absoulte `transform` value.
This way, the drawer's width can change while it is open without having to
recalculate `translateX` on every `resize`.
However, it has to be removed before we move the drawer via `translateX` again.


```js
    prepareInteraction() {
      if (hasCSSOM) {
        this.contentEl.attributeStyleMap.set("will-change", "transform");
        this.scrimEl.attributeStyleMap.set("will-change", "opacity");
      } else {
        this.contentEl.style.willChange = "transform";
        this.scrimEl.style.willChange = "opacity";
      }
      this.fireEvent("prepare");
    }
```

Cleanup code after a completed interaction.
Will add/remove the beforementioned `hy-drawer-opened` class.


```js
    cleanupInteraction(opened) {
      if (hasCSSOM) {
        this.contentEl.attributeStyleMap.delete("will-change");
        this.scrimEl.attributeStyleMap.delete("will-change");

        if (opened) {
          this.scrimEl.attributeStyleMap.set("pointer-events", new CSSKeywordValue("all"));
        } else {
          this.scrimEl.attributeStyleMap.delete("pointer-events");
        }
      } else {
        this.scrimEl.style.willChange = "";
        this.contentEl.style.willChange = "";

        if (opened) {
          this.scrimEl.style.pointerEvents = "all";
        } else {
          this.scrimEl.style.pointerEvents = "";
        }
      }
```

If the xperimental back button feature is enabled we hack the history API,
so that it matches the state of the drawer...


```js
      /*
      if (this._backButton) {
        const id = histId.call(this);
        const hash = `#${id}--opened`;

        if (opened && window.location.hash !== hash) {
          window.history.pushState({ [id]: true }, document.title, hash);
        }

        if (!opened
            && (window.history.state && window.history.state[histId.call(this)])
            && window.location.hash !== '') {
          window.history.back();
        }
      }
      */
```

Once we're finished cleaning up, we fire the `transitioned` event.


```js
      this.fireEvent("transitioned", { detail: opened });
    }
```

#### Update DOM
In the end, we only modify two properties: The x-coordinate of the drawer,
and the opacity of the scrim, which is handled by `updateDOM`.


```js
    updateDOM(translateX, drawerWidth) {
      this.translateX = translateX;

      const inv = this.align === "left" ? 1 : -1;
      const opacity = (this.opacity = (translateX / drawerWidth) * inv);

      if (this.moveCallback) this.moveCallback({ translateX, opacity });
      /* this.fireEvent("move", { detail: { translateX, opacity } }); */

      if (hasCSSOM) {
        this.contentEl.attributeStyleMap.set(
          "transform",
          new CSSTransformValue([new CSSTranslate(CSS.px(translateX), CSS.px(0))])
        );
        this.scrimEl.attributeStyleMap.set("opacity", this.opacity);
      } else {
        this.contentEl.style.transform = `translateX(${translateX}px)`;
        this.scrimEl.style.opacity = this.opacity;
      }
    }
  };
```


