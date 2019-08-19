// The base duration of the fling animation.
export const BASE_DURATION = 200;
// We adjust the duration of the animation using the width of the drawer.
// There is no physics to this, but we know from testing that the animation starts to feel bad
// when the drawer increases in size.
// From testing we know that, if we increase the duration as a fraction of the drawer width,
// the animation stays smooth across common display sizes.
export const WIDTH_CONTRIBUTION = 0.15;
// Minimum velocity of the drawer (in px/ms) when releasing to make it fling to opened/closed state.
export const VELOCITY_THRESHOLD = 0.15;
