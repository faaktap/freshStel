/*
slice is not defined!!!
export const _delay = function(wait, func) {
  var args = slice.call(arguments, 2);
  return setTimeout(function(){ return func.apply(null, args); }, wait);
};
*/

export function debounce (fn, delay) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)  
    timeoutID = setTimeout(fn.bind(this),delay,arguments);
  }
}

