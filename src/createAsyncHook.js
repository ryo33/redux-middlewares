import createMiddleware from './createMiddleware.js'

export default (...args) => store => nextDispatch => {
  const dispatch = createMiddleware(...args)(store)(() => {})
  return action => {
    nextDispatch(action)
    setTimeout(() => {
      dispatch(action)
    }, 0)
  }
}
