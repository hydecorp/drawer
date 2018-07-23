# Styling
The appearance of the component can be customized with [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*).
These only work with the WebComponent version of the component, but each of them has a regular CSS equivalent,
which can be used to style the Vanilla, jQuery and Mixin variant of the component.

* toc
{:toc}

## `--hy-drawer-width`
Specifies the width of the drawer.

Default
: `300px`

CSS equivalent
: `.hy-drawer-content { width: $value }`

***

<!-- ## `--hy-drawer-slide-width`
Specifies the width of the sliding area. Must be less than or equal to the drawer width.
By providing a value that is different from with drawer width, you can let the drawer 'peek' over the edge.

Default
: `--hy-drawer-width`, `300px`

CSS equivalent
: `.hy-drawer-content.hy-drawer-left { left: -$value }` and  
  `.hy-drawer-content.hy-drawer-right { right: -$value }`

*** -->

## `--hy-drawer-background`
The background CSS property of the drawer.

Default
: `#e8e8e8`

CSS equivalent
: `.hy-drawer-content { background: $value }`

***

## `--hy-drawer-box-shadow`
The box shadow CSS property of the drawer.

Default
: `0 0 15px rgba(0, 0, 0, 0.25)`

CSS equivalent
: `.hy-drawer-content { box-shadow: $value }`

***

## `--hy-drawer-scrim-background`
The CSS background property of the scrim (the overlay behind the drawer).

Default
: `rgba(0, 0, 0, 0.5)`

CSS equivalent
: `.hy-drawer-scrim { background: $value }`

***

## `--hy-drawer-z-index`
The Z index of the drawer.

Default
: `30`

CSS equivalent
: `.hy-drawer-content { z-index: $value }`

***

## `--hy-drawer-scrim-z-index`
The Z index of the scrim. Must be lower than `--hy-drawer-z-index`.

Default
: `20`

CSS equivalent
: `.hy-drawer-scrim { z-index: $value }`
