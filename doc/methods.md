# Methods
How calling methods on the component works depends on the version you are using.
When using the Vanilla version, methods are called on the object created by `new`.
When using the jQuery version, methods are called following the 'Bootstrap' convention,
e.g. `$(theEl).componentName('methodName', arg1, arg2, ...args)`.
When using the WebComponent, the methods are available directly on the HTML element.

* toc
{:toc}

## `open`
Opens the drawer.

Arguments:
1.  `animated` (optional)

    Type
    : `Boolean`

    Default
    : `true`

***

## `close`
Closes the drawer.

Arguments:
1.  `animated` (optional)

    Type
    : `Boolean`

    Default
    : `true`

***

## `toggle`
Toggles the drawer.

Arguments:
1.  `animated` (optional)

    Type
    : `Boolean`

    Default
    : `true`
