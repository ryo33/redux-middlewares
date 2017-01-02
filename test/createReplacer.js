const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const { createReplacer } = require('../lib/index.js')

describe('createReplacer(...matchers, callback)', function() {
  it('should replac only the action is matched', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const TYPE3 = 'TYPE 3'
    const action1 = {type: TYPE1, payload: {}}
    const action2 = {type: TYPE2, payload: {}}
    const action3 = {type: TYPE3, payload: {}}

    const state = {}
    const getState = () => state
    const dispatch = sinon.spy(() => {})
    const store = {getState, dispatch}
    const result = {}
    const nextDispatch = sinon.spy(() => result)

    const getReplacer = () => sinon.spy(
      ({getState, action}) => {
        expect(getState()).to.equal(state)
        return action3
      }
    )
    const replacer = getReplacer()
    const middleware = createReplacer(TYPE2, replacer)

    expect(middleware(store)(nextDispatch)(action1)).to.equal(result)
    expect(nextDispatch).to.have.been.calledWithExactly(action1)
    expect(nextDispatch).to.have.been.calledOnce
    expect(dispatch).to.not.have.been.called
    nextDispatch.reset()
    dispatch.reset()

    middleware(store)(nextDispatch)(action2)
    expect(nextDispatch).to.not.have.been.called
    expect(dispatch).to.have.been.calledWithExactly(action3)
    expect(dispatch).to.have.been.calledOnce
    nextDispatch.reset()
    dispatch.reset()

    expect(replacer).to.have.callCount(1)
    expect(replacer.args[0][0].action).to.equal(action2)
  })
})
