// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

/**
  * @param t current time
  * @param b start value
  * @param c change in value
  * @param d duration
  * @returns {number}
  */
function linearTween(t, b, c, d) {
  return ((c * t) / d) + b;
}

function pageDist(p1, p2) {
  return Math.sqrt(((p1.pageX - p2.pageX) ** 2) + ((p1.pageY - p2.pageY) ** 2));
}

function contains(target, className) {
  let t = target;
  while (t != null) {
    if (t.classList && t.classList.contains(className)) {
      return true;
    }
    t = t.parentNode;
  }
  return false;
}

export { linearTween, pageDist, contains };
