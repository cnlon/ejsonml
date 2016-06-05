import JsonML from './index'

var SHOW = 'jbst:visible'
var INIT = 'jbst:oninit'
var LOAD = 'jbst:onload'

// ensures attribute key contains method or is removed
// attr: attribute object
// key: method name
function ensureMethod (attr, key) {
  var method = attr[key] || null
  if (method) {
    // ensure is method
    if (typeof method !== 'function') {
      try {
        /* eslint-disable no-new-func */
        method = new Function(String(method))
        /* eslint-enable no-new-func */
      } catch (ex) {
        // filter
        method = null
      }
    }
    if (method) {
      // IE doesn't like colon in property names
      attr[key.split(':').join('$')] = method
    }
    delete attr[key]
  }
  return method
}

// default onerror handler, override JsonML.BST.onerror to change
function onError (ex) {
  return '[' + ex + ']'
}

// retrieve and remove method
function popMethod (elem, key) {
  // IE doesn't like colon in property names
  key = key.split(':').join('$')

  var method = elem[key]
  if (method) {
    try {
      delete elem[key]
    } catch (ex) {
      // sometimes IE doesn't like deleting from DOM
      elem[key] = undefined
    }
  }
  return method
}

// JsonML Filter
function filter (elem) {
  // execute and remove jbst:oninit method
  var method = popMethod(elem, INIT)
  if (typeof method === 'function') {
    // execute in context of element
    method.call(elem)
  }

  // execute and remove jbst:onload method
  method = popMethod(elem, LOAD)
  if (typeof method === 'function') {
    // queue up to execute after insertion into parentNode
    setTimeout(function () {
      // execute in context of element
      method.call(elem)
      method = elem = null
    }, 0)
  }

  if (JsonML.BST.filter) {
    return JsonML.BST.filter(elem)
  }

  return elem
}

function callContext (
  self, // object
  data, // object
  index, // int
  count, // int
  args, // object
  method, // function
  methodArgs // Array
) {
  try {
    // setup context for code block
    self.data = typeof data !== 'undefined' ? data : null
    self.index = isFinite(index) ? Number(index) : NaN
    self.count = isFinite(count) ? Number(count) : NaN
    self.args = typeof args !== 'undefined' ? args : null
    // execute node in the context of self as 'this', passing in any parameters
    return method.apply(self, methodArgs || [])
  } finally {
    // cleanup contextual members
    delete self.count
    delete self.index
    delete self.data
    delete self.args
  }
}

var appendChild = JsonML.appendChild

/* ctor */
export default function JBST (jbst) {
  if (typeof jbst === 'undefined') {
    throw new Error('JBST tree is undefined')
  }
  var self = this
// recursively applies dataBind to all nodes of the template graph
// NOTE: it is very important to replace each node with a copy,
// otherwise it destroys the original template.
// node: current template node being data bound
// data: current data item being bound
// index: index of current data item
// count: count of current set of data items
// args: state object
// returns: JsonML nodes
  function dataBind (node, data, index, count, args) {
    try {
      // recursively process each node
      if (node) {
        var output
        if (typeof node === 'function') {
          output = callContext(self, data, index, count, args, node)
          if (output instanceof JBST) {
            // allow returned JBSTs to recursively bind
            // useful for creating 'switcher' template methods
            return output.dataBind(data, index, count, args)
          }
          // function result
          return output
        }

        if (node instanceof Array) {
          var onBound = (typeof JsonML.BST.onbound === 'function') && JsonML.BST.onbound
          var onAppend = (typeof JsonML.BST.onappend === 'function') && JsonML.BST.onappend
          var appendCB = onAppend && function (parent, child) {
            callContext(self, data, index, count, args, onAppend, [parent, child])
          }

          // JsonML output
          output = []
          for (var i = 0; i < node.length; i++) {
            var child = dataBind(node[i], data, index, count, args)
            appendChild(output, child, appendCB)
            if (!i && !output[0]) {
              onAppend = appendCB = null
            }
          }

          if (output[0] && onBound) {
            callContext(self, data, index, count, args, onBound, [output])
          }

          // if output has attributes, check for JBST commands
          if (JsonML.hasAttributes(output)) {
            // visibility JBST command
            var visible = output[1][SHOW]
            if (typeof visible !== 'undefined') {
              // cull any false-y values
              if (!visible) {
                // suppress rendering of entire subtree
                return ''
              }
              // remove attribute
              delete output[1][SHOW]
            }

            // jbst:oninit
            ensureMethod(output[1], INIT)

            // jbst:onload
            ensureMethod(output[1], LOAD)
          }

          // JsonML element
          return output
        }

        if (typeof node === 'object') {
          output = {}
          // process each property in template node
          for (var property in node) {
            if (node.hasOwnProperty(property)) {
              // evaluate property's value
              var value = dataBind(node[property], data, index, count, args)
              if (typeof value !== 'undefined' && value !== null) {
                output[property] = value
              }
            }
          }
          // attributes object
          return output
        }
      }

      // rest are simple value types, so return node directly
      return node
    } catch (ex) {
      try {
        // handle error with complete context
        var err = (typeof JsonML.BST.onerror === 'function') ? JsonML.BST.onerror : onError
        return callContext(self, data, index, count, args, err, [ex])
      } catch (ex2) {
        return '[' + ex2 + ']'
      }
    }
  }

  function iterate (node, data, index, count, args) {
    if (data instanceof Array) {
      // create a document fragment to hold list
      var output = ['']
      count = data.length
      for (var i = 0; i < count; i++) {
        // apply template to each item in array
        appendChild(output, dataBind(jbst, data[i], i, count, args))
      }
      // document fragment
      return output
    } else {
      // data is singular so apply template once
      return dataBind(jbst, data, index, count, args)
    }
  }

  // the publicly exposed instance methods

  // combines JBST and JSON to produce JsonML
  self.dataBind = function (data, index, count, args) {
    // data is singular so apply template once
    return iterate(jbst, data, index, count, args)
  }

  /* JBST + JSON => JsonML => DOM */
  self.bind = function (data, index, count, args) {
    // databind JSON data to a JBST template, resulting in a JsonML representation
    var jml = iterate(jbst, data, index, count, args)
    // hydrate the resulting JsonML, executing callbacks, and user-filter
    return JsonML.toHTML(jml, filter)
  }

  // replaces a DOM element with result from binding
  self.replace = function (elem, data, index, count, args) {
    if (typeof elem === 'string') {
      elem = document.getElementById(elem)
    }
    if (elem && elem.parentNode) {
      var jml = self.bind(data, index, count, args)
      if (jml) {
        elem.parentNode.replaceChild(jml, elem)
      }
    }
  }

  // displace a DOM element with result from binding JsonML+BST node bound within this context
  self.displace = function (elem, node, data, ndex, count, args) {
    if (typeof elem === 'string') {
      elem = document.getElementById(elem)
    }

    if (elem && elem.parentNode) {
      // databind JSON data to a JBST template, resulting in a JsonML representation
      var jml = iterate(node, data, index, count, args)

      // hydrate the resulting JsonML, executing callbacks, and user-filter
      jml = JsonML.toHTML(jml, filter)
      if (jml) {
        elem.parentNode.replaceChild(jml, elem)
      }
    }
  }

  // patches a DOM element with JsonML+BST node bound within this context
  self.patch = function (elem, node, data, index, count, args) {
    if (typeof elem === 'string') {
      elem = document.getElementById(elem)
    }
    if (elem) {
      var jml = ['']
      appendChild(jml, dataBind(node, data, index, count, args))
      JsonML.patch(elem, jml, filter)
    }
  }
}
