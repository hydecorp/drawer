# Options
This component offers a variety of configuration options,
the purpose of many of which is to allow you to custom-tailor its behavior to fit within the norms of a particular platform/browser,
without hard-coding any user-agent sniffing into of the component itself.

* toc
{:toc}

## `touchEvents`
Allows the drawer to be pulled with touch gestures.

Type
: `Boolean`

Default
: `false`  

HTML attribute
: `touch-events`

jQuery attribute
: `data-touch-events`

***

## `opened`
Indicates whether the component is currently opened or closed.
Setting a value will cause it to animate to the new state.

Type
: `Boolean`

Default
: `false`

HTML attribute
: `opened`

jQuery attribute
: `data-opened`

***

## `align`
The alignment of the drawer. Can be either to the `left` or to the `right`.
Setting it this value will cause the drawer to jump to the other side.

Type
: `String` (One of: `left`, `right`)

Default
: `left`

HTML attribute
: `align`

jQuery attribute
: `data-align`

***

## `range`
Sets the range in pixels from either left or right side of the screen (depending on [alignment](#align)) from within which the drawer can be drawn.

You can use this to account for native gestures, e.g. iOS Safari has a ~35 pixel area on the sides where native 'forward' and 'backward' gestures can be initiated. Setting the range to something like `[35, 135]` prevents these from overlapping.

Note that the range can overlap with the content area without interfering with scrolling, since hy-drawer will still distinguish between horizontal and vertical sliding motions: See [threshold](#threshold) for more.

Type
: `Array` of `Number` (length must be 2, numbers are pixels)

Default
: `[0, 100]`

HTML attribute
: `range` (e.g. `range="0,100"`)

jQuery attribute
: `data-range` (e.g. `data-range="0,100"`)

***

## `persistent`
Indicates whether the drawer is in 'persistent' state.
While persistent, the drawer can't be moved with touch events (or mouse move events when [mouseEvents](#mouseevents) are enabled),
and the scrim will not be visible. However, the drawer can be opened/closed using [methods](./methods.md).

Type
: `Boolean`

Default
: `false`

HTML attribute
: `persistent`

jQuery attribute
: `data-persistent`

***

## `preventDefault`
When true, **hy-drawer** will call `preventDefault` on every (touch-)move event,
effectively preventing scrolling while sliding the drawer.

This results in much better experience on devices that can handle the scripting load.
However, since the `touchmove` listener has to be registered with the `passive: false` flag set in this case,
this also means that page scrolling is delayed by the time it takes the move handler to complete.

Type
: `Boolean`

Default
: `false`  

HTML attribute
: `prevent-default`

jQuery attribute
: `data-prevent-default`

***

## `threshold`
Minimum distance the finger/mouse has to travel after a `touchstart`/`mousedown` event before deciding whether to slide the drawer or letting the browser take over and scroll the document.

It makes sense setting this to `0` on iOS devices, since webkit won't trigger a `touchmove` event until the finger has moved ~10 pixels anyway.


Type
: `Number` (pixels)

Default
: 10  

HTML attribute
: `threshold`

jQuery attribute
: `data-threshold`

***

## `mouseEvents`
Allows the drawer to be pulled with the mouse. This is mostly for presentation purposes,
as pulling things with the mouse isn't a common pattern (other than to resize things).

Type
: `Boolean`

Default
: `false`  

HTML attribute
: `mouse-events`

jQuery attribute
: `data-mouse-events`
