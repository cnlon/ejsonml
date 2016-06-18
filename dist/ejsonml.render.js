/**
 * ejsonml-render --- By longhao <longhaohe@gmail.com> (http://longhaohe.com/)
 * Github: https://github.com/longhaohe/ejsonml-render
 * MIT Licensed.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('ejsonml_render', factory) :
  (global.ejsonml_render = factory());
}(this, function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

  function render(ejml, scope, global, subScope) {
    var res = void 0;
    if (!ejml) {
      res = '';
    } else if (Array.isArray(ejml)) {
      var _ret = function () {
        var _ejml = toArray(ejml);

        var node = _ejml[0];
        var attributes = _ejml[1];

        var children = _ejml.slice(2);

        if (node === '*') {
          node = createFragment(node);
          computedAttributes(attributes, scope, global, subScope, function (sub) {
            appendChildren(node, children, scope, global, sub);
          });
        } else {
          node = createNode(node);
          setAttributes(node, attributes, scope, global, subScope);
          appendChildren(node, children, scope, global, subScope);
        }
        return {
          v: node
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    } else if (typeof ejml === 'function') {
      res = render.eval(ejml, scope, global, subScope);
    } else {
      res = ejml;
    }
    return createTextNode(res);
  }

  render.eval = function evaluate(func, scope, global, subScope) {
    try {
      return func(scope, global, subScope || {});
    } catch (err) {
      return undefined;
    }
  };

  function createNode(tagName) {
    return document.createElement(tagName);
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }

  function createFragment() {
    return document.createDocumentFragment();
  }

  function setAttributes(node, attributes, scope, global, subScope) {
    var attr = void 0,
        val = void 0;
    Object.keys(attributes).forEach(function (key) {
      if (key[0] === '@') {
        // event
        subScope = subScope || {};
        node.addEventListener(key.slice(1), function (event) {
          subScope.$event = event;
          render.eval(attributes[key], scope, global, subScope);
        });
      } else {
        attr = document.createAttribute(key);
        val = attributes[key];
        if (typeof val === 'function') {
          val = render.eval(val, scope, global, subScope);
        }
        attr.nodeValue = val;
        node.setAttributeNode(attr);
      }
    });
  }

  function computedAttributes(attributes, scope, global, subScope, callback) {
    var $if = attributes['*if'];
    if ($if) {
      $if = render.eval($if, scope, global, subScope);
      if (!$if) return;
    }
    var $items = attributes['*for'];
    if ($items) {
      (function () {
        $items = render.eval($items, scope, global, subScope);
        var sub = subScope ? Object.assign({}, subScope) : {};
        var subKey = attributes['_forKey'];($items || []).forEach(function (v, k) {
          sub[subKey] = v;
          sub.$index = k;
          callback(sub);
        });
      })();
    } else {
      callback(scope, global, subScope);
    }
  }

  function appendChildren(node, children, scope, global, subScope) {
    children.forEach(function (child) {
      node.appendChild(render(child, scope, global, subScope));
    });
  }

  return render;

}));
//# sourceMappingURL=ejsonml.render.js.map