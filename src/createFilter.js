const createMiddleware = require('./createMiddleware.js')

module.exports = (...matchers) => {
  const filter = matchers.pop()
  const negatedFilter = (arg) => !filter(arg)
  return createMiddleware(...matchers, negatedFilter, () => {})
}
