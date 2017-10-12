# Events
Events are dispatched from the root element of the component and are prefixed with the name of the component.
Note that --- to be an idiomatic WebComponent --- all communication form the component back to the outside world occurs via events.

* toc
{:toc}

## `hy-drawer-init`
This event is fired after the component has been initialized.
The current `opened` state is provided in the `detail` field of the event.

## `hy-drawer-slidestart`
This event is fired when the user starts sliding the drawer.
Note that this event does not occur on every touch motion, since the user could also be scrolling the page!

## `hy-drawer-slideend`
This event is fired when the user stops sliding the drawer, i.e. it is always proceeded by a `slidestart` event.
However, it is fired *before* the drawer starts transitioning towards the next `opened` state.
The next `opened` state is provided in the `detail` field of the event.

## `hy-drawer-transitioned`
This event is fired after a completed transitioning to the new `opened` state.
The new `opened` state is provided in the `detail` field of the event.
