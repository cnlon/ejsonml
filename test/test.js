var assert = require('chai').assert
var init = require('../dist/ejsonml.js')

var equal = assert.equal

/* global describe, it */
describe('ejsonml', function () {
  it('should return "pass"', function () {
    equal(init(), 'pass')
  })
})
