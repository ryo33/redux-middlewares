import createMiddleware from './createMiddleware.js'

export default (...matchers) => {
  const replacer = matchers.pop()
  const callback = ({getState, dispatch, action}) => {
    return dispatch(replacer({getState, action}))
  }
  return createMiddleware(...matchers, callback)
}
