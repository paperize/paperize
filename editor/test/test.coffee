import store from '../lib/store'

console.log("Storin' it!", store.state)

assert = require('assert')

describe 'Array', ->
  describe '#indexOf()', ->
    it 'should return -1 when the value is not present', ->
      assert.equal(-1, [1,2,3].indexOf(4))
