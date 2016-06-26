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

  babelHelpers.slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  babelHelpers;

  var values = {
    text: 'textContent',
    textContent: 'textContent',
    innerText: 'innerText',
    html: 'innerHTML',
    innerHTML: 'innerHTML'
  };

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
        var _ejml = babelHelpers.slicedToArray(ejml, 3);

        var node = _ejml[0];
        var attributes = _ejml[1];
        var children = _ejml[2];

        if (node === 'template') {
          node = createFragment(node);
          attributes && computedAttributes(attributes, scope, subScope, function (sub) {
            children && appendChildren(node, children, scope, sub);
          });
        } else {
          node = createNode(node);
          attributes && setAttributes(node, attributes, scope, subScope);
          children && appendChildren(node, children, scope, subScope);
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
        prop = void 0,
        val = void 0;
    Object.keys(attributes).forEach(function (key) {
      if (key[0] === '@') {
        // event
        node.addEventListener(key.slice(1), function (event) {
          subScope.$event = event;
          render.eval(attributes[key], scope, subScope);
        });
      } else {
        prop = values[key];
        if (prop) {
          val = attributes[key];
          if (typeof val === 'function') {
            val = render.eval(val, scope, subScope);
          }
          node[prop] = val;
        } else {
          attr = createAttribute(key);
          val = attributes[key];
          if (typeof val === 'function') {
            val = render.eval(val, scope, subScope);
          }
          attr.nodeValue = val;
          node.setAttributeNode(attr);
        }
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