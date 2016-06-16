import Parser from 'ejsonml-parser'
import render from 'ejsonml-render'

window.onload = function () {
  const tpl =
`
<div>
  <h1 :text="_.title"></h1>
  <p  *if="arr.length" *for="d in arr" class="claz1" :class="'claz2'" style="background: lightgreen;" :style="styl">
    <input :value="d + name" @keypress="keep($event)" @click="alert(name, $event)"/>
  </p>
</div>
`
  document.getElementById('tpl').textContent = tpl

  const parser = new Parser(tpl)
  const hjson = parser.parse()
  document.getElementById('hjson').textContent = JSON.stringify(hjson, null, 2)

  const scope = {
    arr: ['1. ', '2. '],
    name: '张三',
    styl: 'font-size: 32px;',
    alert (a, e) {
      console.log(this.name)
      console.log(e.target)
    },
    keep (e) {
      console.log(e.target.value)
    },
  }
  const global = {
    title: 'Welcome!',
  }
  const hj = parser.parse(true) // debug mode
  const dom = render(hj, scope, global)
  document.getElementById('dom').appendChild(dom)
}
