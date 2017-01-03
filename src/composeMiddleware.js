module.exports = (...middlewares) => {
  return store => next => {
    const dispatchCreators = middlewares.map(middleware => middleware(store))
    let dispatch = next
    for (let i = dispatchCreators.length - 1; i >= 0; i --) {
      dispatch = dispatchCreators[i](dispatch)
    }
    return dispatch
  }
}
