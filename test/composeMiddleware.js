const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const { composeMiddleware } = require('../lib/index.js')

describe('composeMiddleware(...middlewares)', function() {
  it('should compose correctly', function() {
    const TYPE = 'TYPE'
    const action = {type: TYPE, payload: false}

    const state = {}
    const getState = () => state
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = () => {}

    let dispatch1, dispatch2, dispatch3
    const middleware1 = ({ getState, dispatch }) => next => {
      return dispatch1 = action => {
        expect(getState()).to.equal(state)
        expect(dispatch).to.equal(dispatch)
        expect(next).to.equal(nextDispatch)
      }
    }
    const middleware2 = ({ getState, dispatch }) => next => {
      return dispatch2 = action => {
        expect(getState()).to.equal(state)
        expect(dispatch).to.equal(dispatch)
        expect(next).to.equal(dispatch1)
      }
    }
    const middleware3 = ({ getState, dispatch }) => next => {
      return dispatch3 = action => {
        expect(getState()).to.equal(state)
        expect(dispatch).to.equal(dispatch)
        expect(next).to.equal(dispatch2)
      }
    }

    const middleware = composeMiddleware(
      middleware3, middleware2, middleware1
    )
    const composedDispatch = middleware(store)(nextDispatch)

    expect(dispatch1).to.not.undefined
    expect(dispatch2).to.not.undefined
    expect(dispatch3).to.not.undefined
    expect(composedDispatch).to.equal(dispatch3)
  })

  it('should compose correctly even if no middleware is given', function() {
    const TYPE = 'TYPE'
    const action = {type: TYPE, payload: false}

    const state = {}
    const getState = () => state
    const dispatch = () => {}
    const store = {getState, dispatch}
    const nextDispatch = () => {}

    const middleware = composeMiddleware()
    const composedDispatch = middleware(store)(nextDispatch)
    expect(composedDispatch).to.equal(nextDispatch)
  })
})
