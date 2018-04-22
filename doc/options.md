# Options
This component offers a variety of configuration options,
the purpose of many of which is to allow you to custom-tailor its behavior to fit within the norms of a particular platform/browser,
without hard-coding any user-agent sniffing into of the component itself.

* toc
{:toc}

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
Sets the range in pixels from either left or right side of the screen (depending on [alignment](#align))
from within which the drawer can be drawn. You can use this to account for native gestures,
e.g. iOS Safari has a ~35 pixel area on the sides from where to initiate native 'forward' and 'backward' motions,
so that you may want to set the range to `[35, 135]`.
Note that the range can overlap with the content area, since hy-drawer will still discriminate between horizontal and vertical motions.

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
Related to [preventDefault](#preventdefault) is the threshold option.
TODO

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
