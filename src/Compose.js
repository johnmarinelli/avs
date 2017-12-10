// caveat: this compose fn expects all of `fns` to require one argument, 
// except the very first argument
const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)));

export default compose;
