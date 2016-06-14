var assert = require('chai').assert
var render = require('../dist/ejsonml.render.js')

var equal = assert.equal

/* global describe, it */
describe('ejsonml', function () {
  const template = [
    'p',
    {
      class: 'className',
      style: 'background-color: #eee',
    },
    [
      'i',
      null,
      function ($) {
        return $.name + '，'
      },
    ],
    '你好！',
  ]
  const scope = {
    name: '张三',
  }
  it('should equal 张三', function () {
    const dom = render(template, scope)
    const name = dom.querySelector('i').textContent
    equal(name, '张三')
  })
})
