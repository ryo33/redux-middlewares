const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const { createAsyncHook } = require('../lib/index.js')

let clock

before(function () { clock = sinon.useFakeTimers() })
after(function () { clock.restore() })

describe('createAsyncHook(...matchers, callback)', function() {
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

    const getCallback = () => sinon.spy(({getState, dispatch}) => {
      expect(getState()).to.equal(state)
      expect(dispatch).to.equal(dispatch)
    })

    const singleTypeCallback = getCallback()
    const singleTypeMiddleware = createAsyncHook(TYPE1, singleTypeCallback)

    const arrayTypesCallback = getCallback()
    const array = [TYPE1, TYPE2]
    const arrayTypesMiddleware = createAsyncHook(array, arrayTypesCallback)

    const matcherCallback = getCallback()
    const matcher = ({action}) => action.type === TYPE3 || action.payload
    const matcherMiddleware = createAsyncHook(matcher, matcherCallback)

    const multiMatcherCallback = sinon.spy()
    const multiMatcherMiddleware = createAsyncHook(
      array, matcher,
      multiMatcherCallback
    )

    singleTypeMiddleware(store)(nextDispatch)(action1)
    singleTypeMiddleware(store)(nextDispatch)(action2)
    singleTypeMiddleware(store)(nextDispatch)(action3)
    clock.tick(1)
    expect(singleTypeCallback).to.have.been.calledOnce
    expect(singleTypeCallback.args[0][0].action).to.equal(action1)

    arrayTypesMiddleware(store)(nextDispatch)(action1)
    arrayTypesMiddleware(store)(nextDispatch)(action2)
    arrayTypesMiddleware(store)(nextDispatch)(action3)
    clock.tick(1)
    expect(arrayTypesCallback).to.have.been.calledTwice
    expect(arrayTypesCallback.args[0][0].action).to.equal(action1)
    expect(arrayTypesCallback.args[1][0].action).to.equal(action2)

    matcherMiddleware(store)(nextDispatch)(action1)
    matcherMiddleware(store)(nextDispatch)(action2)
    matcherMiddleware(store)(nextDispatch)(action3)
    clock.tick(1)
    expect(matcherCallback).to.have.been.calledTwice
    expect(matcherCallback.args[0][0].action).to.equal(action2)
    expect(matcherCallback.args[1][0].action).to.equal(action3)

    multiMatcherMiddleware(store)(nextDispatch)(action1)
    multiMatcherMiddleware(store)(nextDispatch)(action2)
    multiMatcherMiddleware(store)(nextDispatch)(action3)
    clock.tick(1)
    expect(multiMatcherCallback).to.have.been.calledOnce
    expect(multiMatcherCallback.args[0][0].action).to.equal(action2)
  })

  it('should call matchers and callback asynchronously', function() {
    const TYPE1 = 'TYPE 1'
    const action1 = {type: TYPE1, payload: false}

    const state = {}
    const getState = () => state
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = sinon.spy()

    const delayFunction = sinon.spy()
    const matcher1 = sinon.spy(() => true)
    const callback1 = sinon.spy(({getState, dispatch}) => {
      expect(getState()).to.equal(state)
      expect(dispatch).to.equal(dispatch)
      setTimeout(delayFunction, 1)
    })
    const middleware1 = createAsyncHook(matcher1, callback1)

    middleware1(store)(nextDispatch)(action1)
    expect(nextDispatch).to.have.been.calledOnce
    expect(matcher1).to.not.have.been.called
    clock.tick(1)
    expect(matcher1).to.have.been.calledOnce
    expect(callback1).to.have.been.calledOnce
    clock.tick(1)
    expect(delayFunction).to.have.been.calledOnce
  })
})
