function getBrowserCapabilities() {
  const styles = window.getComputedStyle(document.documentElement, '');
  const pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
  return {
    prefix: `-${pre}-`,
    transform: `${pre[0].toUpperCase() + pre.substr(1)}Transform`,
  };
}

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
  return Math.sqrt(
    Math.pow(p1.pageX - p2.pageX, 2) +
    Math.pow(p1.pageY - p2.pageY, 2)
  );
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

export { getBrowserCapabilities, linearTween, pageDist, contains };
