const createMiddleware = require('./createMiddleware.js')

module.exports = (...matchers) => {
  const filter = matchers.pop()
  const callback = ({getState, nextDispatch, action}) => {
    if (filter({getState, action})) {
      return nextDispatch(action)
    }
  }
  return createMiddleware(...matchers, callback)
}
