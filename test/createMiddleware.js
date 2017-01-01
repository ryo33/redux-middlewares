const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const { createMiddleware } = require('../lib/index.js')

describe('createMiddleware(action, callback)', function() {
  it('it should call the callback only the action is matched', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const TYPE3 = 'TYPE 3'
    const action1 = {type: TYPE1, payload: false}
    const action2 = {type: TYPE2, payload: true}
    const action3 = {type: TYPE3, payload: false}

    const getState = () => ({})
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = () => {}

    const singleTypeCallback = sinon.spy()
    const singleTypeMiddleware = createMiddleware(TYPE1, singleTypeCallback)

    const arrayTypesCallback = sinon.spy()
    const array = [TYPE1, TYPE2]
    const arrayTypesMiddleware = createMiddleware(array, arrayTypesCallback)

    const matcherCallback = sinon.spy()
    const matcher = action => action.type === TYPE3 || action.payload
    const matcherMiddleware = createMiddleware(matcher, matcherCallback)

    singleTypeMiddleware(store)(nextDispatch)(action1)
    singleTypeMiddleware(store)(nextDispatch)(action2)
    singleTypeMiddleware(store)(nextDispatch)(action3)
    expect(singleTypeCallback.args).to.eql([
      [{getState, dispatch, nextDispatch, action: action1}]
    ])

    arrayTypesMiddleware(store)(nextDispatch)(action1)
    arrayTypesMiddleware(store)(nextDispatch)(action2)
    arrayTypesMiddleware(store)(nextDispatch)(action3)
    expect(arrayTypesCallback.args).to.eql([
      [{getState, dispatch, nextDispatch, action: action1}],
      [{getState, dispatch, nextDispatch, action: action2}]
    ])

    matcherMiddleware(store)(nextDispatch)(action1)
    matcherMiddleware(store)(nextDispatch)(action2)
    matcherMiddleware(store)(nextDispatch)(action3)
    expect(matcherCallback.args).to.eql([
      [{getState, dispatch, nextDispatch, action: action2}],
      [{getState, dispatch, nextDispatch, action: action3}]
    ])
  })

  it('it should return the result of nextDispatch', function() {
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

  it('it should call nextDispatch only the action is not matched', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const action1 = {type: TYPE1, payload: false}
    const action2 = {type: TYPE2, payload: true}

    const result1 = {}
    const result2 = {}

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
})
