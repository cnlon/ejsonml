import render from 'ejsonml'

import '../css/demo.css'
import template from '../templates/demo'

const scope = {
  arr: ['This is first paragraph', 'This is second paragraph'],
  styl: 'font-size: 32px; color: red',
  claz: 'demo-grid',
  name: 'world',
  hello (event) {
    let target = event.target
    this.name += '!!!'
    let text = target.textContent + ' ' + this.name
    let output = document.getElementById('output')
    output.innerText += '\n' + text
  },
}
const global = {
  title: 'This is title',
}
const dom = render(template, scope, global)

export default dom
