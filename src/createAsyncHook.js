import createMiddleware from './createMiddleware.js'

const doNothing = () => {}

export default (...args) => store => nextDispatch => {
  const middleware = createMiddleware(...args)
  return action => {
    const state = store.getState()
    const dispatch = store.dispatch
    const getState = () => state
    nextDispatch(action)
    setTimeout(() => {
      middleware({dispatch, getState})(doNothing)(action)
    }, 0)
  }
}
