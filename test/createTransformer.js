const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const { createTransformer } = require('../lib/index.js')

describe('createTransformer(...matchers, callback)', function() {
  it('should transform only the action is matched', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const TYPE3 = 'TYPE 3'
    const action1 = {type: TYPE1, payload: {}}
    const action2 = {type: TYPE2, payload: {}}
    const action3 = {type: TYPE3, payload: {}}

    const state = {}
    const getState = () => state
    const dispatch = () => {}
    const store = {getState, dispatch}
    const result = {}
    const nextDispatch = sinon.spy(() => result)

    const getTransformer = () => sinon.spy(
      ({getState, action}) => {
        expect(getState()).to.equal(state)
        return action3
      }
    )
    const transformer = getTransformer()
    const middleware = createTransformer(TYPE2, transformer)

    expect(middleware(store)(nextDispatch)(action1)).to.equal(result)
    expect(nextDispatch).to.have.been.calledWithExactly(action1)
    expect(nextDispatch).to.have.been.calledOnce
    nextDispatch.reset()

    expect(middleware(store)(nextDispatch)(action2)).to.equal(result)
    expect(nextDispatch).to.have.been.calledWithExactly(action3)
    expect(nextDispatch).to.have.been.calledOnce
    nextDispatch.reset()

    expect(transformer).to.have.callCount(1)
    expect(transformer.args[0][0].action).to.equal(action2)
  })
})
