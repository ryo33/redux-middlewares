const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const { createMiddleware } = require('../lib/index.js')

describe('createMiddleware(...matchers, callback)', function() {
  it('should call the callback only the action is matched', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const TYPE3 = 'TYPE 3'
    const action1 = {type: TYPE1, payload: false}
    const action2 = {type: TYPE2, payload: true}
    const action3 = {type: TYPE3, payload: false}

    const state = {}
    const getState = () => state
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = () => {}

    const getCallback = () => sinon.spy(({getState, dispatch, nextDispatch}) => {
      expect(getState()).to.equal(state)
      expect(dispatch).to.equal(dispatch)
      expect(nextDispatch).to.equal(nextDispatch)
    })

    const singleTypeCallback = getCallback()
    const singleTypeMiddleware = createMiddleware(TYPE1, singleTypeCallback)

    const arrayTypesCallback = getCallback()
    const array = [TYPE1, TYPE2]
    const arrayTypesMiddleware = createMiddleware(array, arrayTypesCallback)

    const matcherCallback = getCallback()
    const matcher = ({action}) => action.type === TYPE3 || action.payload
    const matcherMiddleware = createMiddleware(matcher, matcherCallback)

    const multiMatcherCallback = sinon.spy()
    const multiMatcherMiddleware = createMiddleware(
      array, matcher,
      multiMatcherCallback
    )

    singleTypeMiddleware(store)(nextDispatch)(action1)
    singleTypeMiddleware(store)(nextDispatch)(action2)
    singleTypeMiddleware(store)(nextDispatch)(action3)
    expect(singleTypeCallback).to.have.been.calledOnce
    expect(singleTypeCallback.args[0][0].action).to.equal(action1)

    arrayTypesMiddleware(store)(nextDispatch)(action1)
    arrayTypesMiddleware(store)(nextDispatch)(action2)
    arrayTypesMiddleware(store)(nextDispatch)(action3)
    expect(arrayTypesCallback).to.have.been.calledTwice
    expect(arrayTypesCallback.args[0][0].action).to.equal(action1)
    expect(arrayTypesCallback.args[1][0].action).to.equal(action2)

    matcherMiddleware(store)(nextDispatch)(action1)
    matcherMiddleware(store)(nextDispatch)(action2)
    matcherMiddleware(store)(nextDispatch)(action3)
    expect(matcherCallback).to.have.been.calledTwice
    expect(matcherCallback.args[0][0].action).to.equal(action2)
    expect(matcherCallback.args[1][0].action).to.equal(action3)

    multiMatcherMiddleware(store)(nextDispatch)(action1)
    multiMatcherMiddleware(store)(nextDispatch)(action2)
    multiMatcherMiddleware(store)(nextDispatch)(action3)
    expect(multiMatcherCallback).to.have.been.calledOnce
    expect(multiMatcherCallback.args[0][0].action).to.equal(action2)
  })

  it('should always call the callback if no matcher is given', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const TYPE3 = 'TYPE 3'
    const action1 = {type: TYPE1, payload: false}
    const action2 = {type: TYPE2, payload: true}
    const action3 = {type: TYPE3, payload: false}

    const state = {}
    const getState = () => state
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = () => {}

    const getCallback = () => sinon.spy(({getState, dispatch, nextDispatch}) => {
      expect(getState()).to.equal(state)
      expect(dispatch).to.equal(dispatch)
      expect(nextDispatch).to.equal(nextDispatch)
    })
    const callback = getCallback()
    const middleware = createMiddleware(callback)

    middleware(store)(nextDispatch)(action1)
    middleware(store)(nextDispatch)(action2)
    middleware(store)(nextDispatch)(action3)
    expect(callback).to.have.been.calledThrise
    expect(callback.args[0][0].action).to.equal(action1)
    expect(callback.args[1][0].action).to.equal(action2)
    expect(callback.args[2][0].action).to.equal(action3)
  })

  it('should return the result of nextDispatch', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const action1 = {type: TYPE1, payload: false}
    const action2 = {type: TYPE2, payload: true}

    const result1 = {}
    const result2 = {}

    const getState = () => ({})
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = () => result2

    const callback = () => result1
    const singleTypeCallback = sinon.spy(callback)
    const middleware = createMiddleware(TYPE1, singleTypeCallback)

    expect(middleware(store)(nextDispatch)(action1)).to.equal(result1)
    expect(middleware(store)(nextDispatch)(action2)).to.equal(result2)
  })

  it('should call nextDispatch only the action is not matched', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const action1 = {type: TYPE1, payload: false}
    const action2 = {type: TYPE2, payload: true}

    const getState = () => ({})
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = sinon.spy()

    const singleTypeCallback = sinon.spy()
    const middleware = createMiddleware(TYPE1, singleTypeCallback)

    middleware(store)(nextDispatch)(action1)
    expect(nextDispatch).to.not.have.been.called

    middleware(store)(nextDispatch)(action2)
    expect(nextDispatch).to.have.been.calledWithExactly(action2)
    expect(nextDispatch.calledOnce).to.true
  })

  it('should not call getState more than once at matching', function() {
    const TYPE = 'TYPE'
    const action = {type: TYPE, payload: false}

    const state = {}
    const getState = sinon.spy(() => state)
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = sinon.spy()

    const expectGetStateToHaveBeenCalledOnce = () => {
      expect(getState).to.have.been.calledOnce
    }

    const matcher1 = sinon.spy(({getState, action}) => {
      expect(action).to.equal(action)
      expect(getState()).to.equal(state)
      expectGetStateToHaveBeenCalledOnce()
      return true
    })
    const matcher2 = sinon.spy(({getState, action}) => {
      expect(action).to.equal(action)
      expect(getState()).to.equal(state)
      expectGetStateToHaveBeenCalledOnce()
      return true
    })
    const matcher3 = sinon.spy(({getState, action}) => {
      expect(action).to.equal(action)
      expect(getState()).to.equal(state)
      expectGetStateToHaveBeenCalledOnce()
      return true
    })
    const callback = sinon.spy(({getState, action}) => {
      expect(action).to.equal(action)
      expect(getState()).to.equal(state)
    })
    const middleware = createMiddleware(
      matcher1, matcher2, matcher3, callback)

    middleware(store)(nextDispatch)(action)
    expect(matcher1).to.have.been.calledOnce
    expect(matcher2).to.have.been.calledOnce
    expect(matcher3).to.have.been.calledOnce
    expect(callback).to.have.been.calledOnce
    expect(getState).to.have.been.calledTwice

    getState.reset()

    middleware(store)(nextDispatch)(action)
    expect(getState).to.have.been.calledTwice
  })
})
