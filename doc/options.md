# Options

* toc
{:toc}

## opened

Default
: `false`

Type
: Boolean

HTML Attribute
: `opened`

TODO

***

## align

Default
: `left`

Type
: String (One of: `left`, `right`)

HTML Attribute
: `align`

TODO

***

## transitionDuration

Default
: `250`

Type
: Number (Milliseconds)

HTML Attribute
: `transition-duration`

TODO

***

## persistent

Default
: `false`

Type
: Boolean

HTML Attribute
: `persistent`

TODO

***

## scrollSelector

Default
: `body`

Type
: String (CSS selector)

HTML Attribute
: `scroll-selector`

y-drawer may prevent scrolling while sliding the drawer,
by setting `overflow-y` to `hidden` on the container responsible for scrolling
(usually the document body).
The container can be changed by providing a different CSS selector.
The behavior can be disabled by setting it to `null`.
Note that this option does not work with iOS Safari (10 and previous).
See `preventDefault` for more.

TODO

***

## edgeMargin

Default
: `0`

Type
: Number (device independent pixel)

HTML Attribute
: `edge-margin`

TODO

***

## preventDefault
Default
: `false`  

Type
: Boolean

HTML Attribute
: `prevent-default`

When true, y-drawer will call `preventDefault` on every (touch-)move event,
effectively preventing document scrolling while sliding the drawer.
The same effect is achieved by setting `scrollContainerSelector`,
but does not work on iOS Safari (10 and previous).
This option on the other hand will work on iOS,
but causes a slight (but practically unnoticeable) delay when scrolling.
By setting this option to `false` on Chrome for Android,
a minor performance gain can be achieved.

Specifically, This option will cause event listeners to be registered with `passive: false`,
delaying any native behavior by the time it takes for the event listener to complete.

TODO

***

## mouseEvents

Default
: `false`  

Type
: Boolean

HTML Attribute
: `mouse-events`

Allows the drawer to be pulled with the mouse. This is more geared towards presentation purposes,
as it interferes with other mouse gestures like text selection. However, this could be solved by calling
`preventDefault` on all elements that shouldn't trigger pulling of the drawer.
