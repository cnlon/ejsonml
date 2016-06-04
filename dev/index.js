import init from 'src'

window.onload = function () {
  const elem = document.getElementById('app')
  const res = init()
  elem.textContent = res
}
