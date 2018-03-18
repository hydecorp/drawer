# Gold Standard
This component follows the [Web Components Gold Standard][wcgs] to the extent possible.

[wcgs]: https://github.com/webcomponents/gold-standard/wiki


## Loading

> ✓ Expressed Dependencies — Does the component import or otherwise load all of its own dependencies?

Yes. The -lite version does not include polyfills.
The component can be used via webpack/browserify to avoid loading RxJS twice when already using it.

> ✓ Load Order Independence — Can you load the component at any point?

Yes.

> ✓ Relative Paths — Are all paths relative to required resources (images, etc.) relative to the component source?

Yes.


## DOM Presence

> ✓ Plain Tag — Can you instantiate the component with just a plain tag (`<my-element>`)?

Yes.

> ✓ Parent/Child Independence — Can you use the component inside any type of parent element, or with any type of child elements?

Yes, but will always be positioned `fixed` (i.e. position in the DOM may confer semantic meaning, but visual presentation will be as a max-height drawer component).

> ✓ Declared Semantics — Does the component expose its semantics by wrapping/extending a native element, or using ARIA roles, states, and properties?

N/A

> ✓ Meaningful Structure — Does the component's DOM structure reflect the meaningful relationship between elements, such that those relationships are clear to a user relying on an assistive device?

N/A

> ✓ Labels — Are the component's significant elements labeled such that a user relying on an assistive device can understand what those elements are for?

Probably not. TODO: figure out if there's a way to represent a drawer with aria labels.

> ✓ Local Effects — Does the component limit its effects to itself (or a designated target element)?

No, will always be positioned `fixed`, either to the left or right end of the window.

> ✓ Detached Instantiation — Can the component be instantiated without being part of the document?

Yes, but might not fully work until attached to the DOM.

> ✓ Detachment — If the component is detached, does it stop listening to page events, and generally suspend non-essential tasks?

Yes, but might fail in edge cases.

> ✓ Reattachment — Can a detached component be added back to the page?

Yes, but might fail in edge cases.


## Content

> ✓ Children Visible — If the component is visible and given an initial set of children, are those children visible without any attributes, methods, event handlers, or styles required?

Yes.

> ✓ Content Assignment — Can you place a `<slot>` element inside a component instance and have the component treat the assigned content as if it were directly inside the component?

Yes.

> ✓ Content Changes — Will the component respond to runtime changes in its content (including distributed content)?

Yes.

> ✓ Child Independence — Can you use the component with a wide range of child element types?

Yes, arbitrary content allowed.

> ✓ Auxiliary Content — Does the component permit the use of child elements that perform auxiliary functions?

Yes.

> ✓ Back-End Independence — Can the component retrieve its content from a variety of a back-end services?

N/A


## Interaction

> ✓ Focusable — If the component is interactive, can you navigate to/through it with Tab and Shift+Tab?

No. A hamburger button, which is typically used to open drawers, is not part of the component.
The hamburger button in the example is focusable, though.

> ✓ Keyboard Support — Can you use the basic aspects of component exclusively with the keyboard?

No. TODO: Is there an idiomatic way to make this work? Maybe focus + arrow right/left? focus + enter?

> ✓ Redundant Sound — If the component uses sound to communicate information,
does it also provide the same information another way?

N/A


## Styling

> ✓ Presentable — If the component is instantiated with no explicit styling, is it reasonably attractive, such that someone could feel comfortable presenting it as is?

Yes.

> ✓ Generic Styling — Generally speaking, is the component’s default appearance straightforward and subdued?

Yes.

> ✓ Informational Animation — Does the component’s default styling only use animation to communicate visually what is happening, rather than for purely artistic effects?

Yes (open/close animations).

> ✓ Default Font — By default, does the component use the inherited font face, size, style, and weight?

Yes.

> ✓ Default Colors — By default, does the component make use of the inherited forecolor and backcolor?

Yes TODO

> ✓ Focus Visible — Can you easily see when the component has focus?

N/A

> ✓ Redundant Color — If the component uses color to communicate information, does it also provide the same information another way?

N/A

> ✓ Size to Content — Does the component automatically size itself to contain its content by default?

No, component will contain content.


> ✓ Stretch to Fit — If you stretch the component (e.g., with absolute positioning or CSS flex), do its elements appropriately stretch as well?

No, component takes on the height of the window.

> ✓ Sufficient Contrast — Are labels, icons, etc. perceivable and usable by low vision users?

N/A

> ✓ High Contrast — Is the component perceivable and usable when High Contrast Mode is enabled?

N/A

> ✓ Automatic Positioning — Does the component automatically calculate positions for its elements?

N/A

> ✓ Child Positioning — Can child elements be positioned relative to their container within the component?

Yes.

> ✓ Responsive — Does the component scale well to standard mobile, tablet, and desktop screen sizes?

Yes.

> ✓ Magnification — Does the component render correctly when magnified?

Yes, component works (tested on iOS).

> ✓ Style Recalc — Can you apply styles to a component instance even after it’s attached to the document?

Yes.

> ✓ Size Recalc — If the component manually positions any subelements relative to its own size, does it appropriately recalc these positions when its own size changes?

N/A


## API

> ✓ Member Order Independence — Can you set or invoke the component’s attributes, properties, and methods in any order?

Yes, but might run into trouble when changing attributes during animations.

> ✓ Member Combinations — Can you generally use all the component’s attributes, properties, and methods in any combination?

Yes.

> ✓ Member Stability — If you change a component property or contents, then immediately get that property or contents, do you generally get the same result back?

Yes.

> ✓ Required Properties — Does the component avoid requiring properties to be set unless absolutely necessary?

Yes.

> ✓ Exposed Methods — Can you programmatically trigger all of the component’s key functionality through methods, rather than relying on user interaction?

Yes.

> ✓ Exposed Events — Does the component raise events for all key points in its use?

Yes.

> ✓ Property Change Events — Does the component raise property change events when — and only when — properties change in response to internal component activity?

Yes, but the name might not be idiomatic: `hy-drawer-transitioned` instead of `hy-drawer-openedchanged`. TODO: Rename before 1.0.0 release?

> ✓ Documented API — Does the component document its public API?

[Yes](./methods.md).


## Performance

> ✓ Computational Performance — Generally speaking, does the component perform its core functions reasonably quickly?

Yes, component does not trigger unnecessary painting (uses `transform` and `opacity`).
JS performance could be better, maybe.

> ✓ Network Performance — If the component uses the network, does it do so efficiently?

N/A

> ✓ Render Performance — Is the component quick to get pixels on the screen when first loading and when updating?

Yes.

> ✓ Vector Graphics — Where possible and appropriate, are the component’s graphics in a scalable vector form?

N/A

> ✓ Progress Feedback — For long operations, can the component provide appropriate feedback?

N/A


## Localization

> ✓ Localizable Strings — Can text presented by the component be replaced for use in other languages?

N/A

> ✓ Date+Time Format — If the component accepts or renders dates and/or times, can you change the date/time format?

N/A

> ✓ Currency Format — If the component accepts or renders currency amounts, can you change the currency format?

N/A

> ✓ Right-to-Left — Can the component be configured to flip its presentation for use in right-to-left languages like Arabic and Hebrew?

Yes, can be aligned either `left` or `right`.


## Factoring

> ✓ Base Class — If the component is a special case of another component, does it appropriately subclass from (or at least compose an instance of) that base class?

N/A

> ✓ Composition — Does the component appropriately delegate responsibilities to existing standard components when possible?

N/A

> ✓ Subclassable — Is the component subclassable?

Yes.

> ✓ Overridable Methods — Does the component provide internal methods for key functionality, such that a subclass can override those methods to refine their behavior?

Yes.


## Development

> ✓ Purpose Statement — Does the component’s header comment begin with a short (ideally, single sentence) statement of the component’s purpose?

No.

> ✓ Code Style Guide — Does the source code comply with a standard source code style guide?

Yes, uses [`eslint-config-airbnb`](https://www.npmjs.com/package/eslint-config-airbnb).

> ✓ Open License — If the component presents itself as open source, has it been assigned a standard form of a common open source license?

[Yes](../LICENSE.md).

> ✓ Clean Console — Does the component avoid writing to the debug console unless specifically requested to do so?

Yes, but will show warnings when using the non-minified version / when `process.env.DEBUG` is `true`.

> ✓ Prefixed Name — Does the component have a name prefixed with a project name, element collection name, organization, or something with semantic meaning?

Yes, `hy-`, which is short for [Hydejack](https://qwtel.com/hydejack/){:.external}, the parent project which prompted its development.
