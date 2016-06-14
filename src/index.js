export default function render (ejml, scope, global, subScope) {
  let res
  if (!ejml) {
    res = ''
  } else if (Array.isArray(ejml)) {
    let [node, attributes, ...children] = ejml
    if (node === '*') {
      node = createFragment(node)
      computedAttributes(attributes, scope, global, subScope, (sub) => {
        appendChildren(node, children, scope, global, sub)
      })
    } else {
      node = createNode(node)
      setAttributes(node, attributes, scope, global, subScope)
      appendChildren(node, children, scope, global, subScope)
    }
    return node
  } else if (typeof ejml === 'function') {
    res = render.eval(ejml, scope, global, subScope)
  } else {
    res = ejml
  }
  return createTextNode(res)
}

render.eval = function evaluate (func, scope, global, subScope) {
  try {
    return func(scope, global, subScope || {})
  } catch (err) {
    return undefined
  }
}

function createNode (tagName) {
  return document.createElement(tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createFragment () {
  return document.createDocumentFragment()
}

function setAttributes (node, attributes, scope, global, subScope) {
  let attr, val
  Object.keys(attributes).forEach(key => {
    if (key[0] === '@') { // event
      subScope = subScope || {}
      node.addEventListener(key.slice(1), (event) => {
        subScope.$event = event
        render.eval(attributes[key], scope, global, subScope)
      })
    } else {
      attr = document.createAttribute(key)
      val = attributes[key]
      if (typeof val === 'function') {
        val = render.eval(val, scope, global, subScope)
      }
      attr.nodeValue = val
      node.setAttributeNode(attr)
    }
  })
}

function computedAttributes (attributes, scope, global, subScope, callback) {
  let $if = attributes['*if']
  if ($if) {
    $if = render.eval($if, scope, global, subScope)
    if (!$if) return
  }
  let $items = attributes['*items']
  if ($items) {
    $items = render.eval($items, scope, global, subScope)
    let sub = subScope
             ? Object.assign({}, subScope)
             : {}
    let subKey = attributes['*for'] || '$item'
    ;($items || []).forEach((v, k) => {
      sub[subKey] = v
      sub.$index = k
      callback(sub)
    })
  } else {
    callback(scope, global, subScope)
  }
}

function appendChildren (node, children, scope, global, subScope) {
  children.forEach(child => {
    node.appendChild(render(child, scope, global, subScope))
  })
}
