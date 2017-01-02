function isMatched(matcher, getState, action) {
  if (Array.isArray(matcher)) {
    return matcher.includes(action.type)
  } else if (typeof matcher === 'function') {
    return matcher({getState, action})
  } else {
    return action.type === matcher
  }
}

module.exports = (...matchers) => {
  const callback = matchers.pop()
  return ({ getState, dispatch }) => {
    let getStateCached
    let state
    if (matchers.length >= 2) {
      getStateCached = () => {
        if (typeof state === 'undefined') {
          state = getState()
          return state
        } else {
          return state
        }
      }
    } else {
      getStateCached = getState
    }
    return nextDispatch => action => {
      state = undefined
      let matched = true
      for (let i = 0; i < matchers.length; i ++) {
        if (!isMatched(matchers[i], getStateCached, action)) {
          matched = false
          break
        }
      }
      if (matched) {
        return callback({getState, dispatch, nextDispatch, action})
      } else {
        return nextDispatch(action)
      }
    }
  }
}
