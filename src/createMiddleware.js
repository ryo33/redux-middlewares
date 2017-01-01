module.exports = (matcher, callback) => {
  let finalMatcher
  if (Array.isArray(matcher)) {
    finalMatcher = action => matcher.includes(action.type)
  } else if (typeof matcher === 'function') {
    finalMatcher = matcher
  } else {
    finalMatcher = action => action.type === matcher
  }
  return ({ getState, dispatch }) => nextDispatch => action => {
    if (finalMatcher(action)) {
      return callback({getState, dispatch, nextDispatch, action})
    } else {
      return nextDispatch(action)
    }
  }
}
