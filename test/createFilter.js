const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const { createFilter } = require('../lib/index.js')

describe('createFilter(...matchers, filter)', function() {
  it('should call the nextDispatch only the action is matched', function() {
    const TYPE1 = 'TYPE 1'
    const TYPE2 = 'TYPE 2'
    const action1 = (payload) => ({type: TYPE1, payload})
    const action2 = (payload) => ({type: TYPE2, payload})

    const state = {}
    const getState = () => state
    const dispatch = () => {}
    const store = {getState, dispatch}
    const result = {}
    const nextDispatch = sinon.spy(() => result)

    const getFilter = () => sinon.spy(
      ({getState, action}) => {
        expect(getState()).to.equal(state)
        return action.payload
      }
    )
    const filter = getFilter()
    const middleware = createFilter(TYPE2, filter)

    const action1false = action1(false)
    expect(middleware(store)(nextDispatch)(action1false)).to.equal(result)
    expect(nextDispatch).to.have.been.calledWithExactly(action1false)
    expect(nextDispatch).to.have.been.calledOnce
    nextDispatch.reset()

    const action1true = action1(true)
    expect(middleware(store)(nextDispatch)(action1true)).to.equal(result)
    expect(nextDispatch).to.have.been.calledWithExactly(action1true)
    expect(nextDispatch).to.have.been.calledOnce
    nextDispatch.reset()

    const action2false = action2(false)
    expect(middleware(store)(nextDispatch)(action2false)).to.be.undefined
    expect(nextDispatch).to.not.have.been.called
    nextDispatch.reset()

    const action2true = action2(true)
    expect(middleware(store)(nextDispatch)(action2true)).to.equal(result)
    expect(nextDispatch).to.have.been.calledWithExactly(action2true)
    expect(nextDispatch).to.have.been.calledOnce
    nextDispatch.reset()

    expect(filter).to.have.callCount(2)
    expect(filter.args[0][0].action).to.equal(action2false)
    expect(filter.args[1][0].action).to.equal(action2true)
  })
})
