/**
 * ejsonml --- By longhao <longhaohe@gmail.com> (http://longhaohe.com/)
 * Github: https://github.com/longhaohe/ejsonml
 * MIT Licensed.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('ejsonml', factory) :
  (global.ejsonml = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

  babelHelpers;

  function render(ejml, scope) {
    return $render(ejml, scope, {});
  }

  render.eval = function evaluate(func, scope, subScope) {
    try {
      return func(scope, subScope);
    } catch (err) {
      return undefined;
    }
  };

  function $render(ejml, scope, subScope) {
    var res = void 0;
    if (!ejml) {
      res = '';
    } else if (Array.isArray(ejml)) {
      var _ret = function () {
        var _ejml = babelHelpers.toArray(ejml);

        var node = _ejml[0];
        var attributes = _ejml[1];

        var children = _ejml.slice(2);

        if (node === '*') {
          node = createFragment(node);
          computedAttributes(attributes, scope, subScope, function (sub) {
            appendChildren(node, children, scope, sub);
          });
        } else {
          node = createNode(node);
          setAttributes(node, attributes, scope, subScope);
          appendChildren(node, children, scope, subScope);
        }
        return {
          v: node
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
    } else if (typeof ejml === 'function') {
      res = render.eval(ejml, scope, subScope);
    } else {
      res = ejml;
    }
    return createTextNode(res);
  }

  function appendChildren(node, children, scope, subScope) {
    children.forEach(function (child) {
      node.appendChild($render(child, scope, subScope));
    });
  }

  function setAttributes(node, attributes, scope, subScope) {
    var attr = void 0,
        val = void 0;
    Object.keys(attributes).forEach(function (key) {
      if (key[0] === '@') {
        // event
        subScope = subScope || {};
        node.addEventListener(key.slice(1), function (event) {
          subScope.$event = event;
          render.eval(attributes[key], scope, subScope);
        });
      } else {
        attr = createAttribute(key);
        val = attributes[key];
        if (typeof val === 'function') {
          val = render.eval(val, scope, subScope);
        }
        attr.nodeValue = val;
        node.setAttributeNode(attr);
      }
    });
  }

  function computedAttributes(attributes, scope, subScope, callback) {
    var $if = attributes['*if'];
    if ($if) {
      $if = render.eval($if, scope, subScope);
      if (!$if) return;
    }
    var $items = attributes['*for'];
    if ($items) {
      $items = render.eval($items, scope, subScope);
      if ($items && $items.length) {
        (function () {
          var sub = subScope ? Object.assign({}, subScope) : {};
          var subKey = attributes['_forKey'];
          $items.forEach(function (v, k) {
            sub[subKey] = v;
            sub.$index = k;
            callback(sub);
          });
        })();
      }
    } else {
      callback(scope, subScope);
    }
  }

  var doc = window.document;

  function createNode(tagName) {
    return doc.createElement(tagName);
  }

  function createTextNode(text) {
    return doc.createTextNode(text);
  }

  function createFragment() {
    return doc.createDocumentFragment();
  }

  function createAttribute(attribute) {
    return doc.createAttribute(attribute);
  }

  return render;

}));
//# sourceMappingURL=ejsonml.js.map