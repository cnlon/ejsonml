import render from 'ejsonml'

import '../css/demo.css'
import template from '../hs/demo'

const scope = {
  arr: ['This is first paragraph', 'This is second paragraph'],
  styl: 'font-size: 32px; color: red',
  claz: 'demo-grid',
  title: 'This is title',
  name: 'world',
  hello (event) {
    let target = event.target
    this.name += '!!!'
    let text = target.textContent + ' ' + this.name
    let output = document.getElementById('output')
    output.innerText += '\n' + text
  },
}
const dom = render(template, scope)

export default dom
