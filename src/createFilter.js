import createMiddleware from './createMiddleware.js'

export default (...matchers) => {
  const filter = matchers.pop()
  const negatedFilter = (arg) => !filter(arg)
  return createMiddleware(...matchers, negatedFilter, () => {})
}
