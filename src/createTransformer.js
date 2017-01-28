import createMiddleware from './createMiddleware.js'

export default (...matchers) => {
  const transformer = matchers.pop()
  const callback = ({getState, nextDispatch, action}) => {
    return nextDispatch(transformer({getState, action}))
  }
  return createMiddleware(...matchers, callback)
}
