import JsonML from 'src'
import bandList from './bandList'
// import memberItem from './memberItem'

window.JsonML = JsonML

window.scope = {}
window.scope.loadData = function (url) {  // data loading helper method
  // quick and dirty data retrieval via JSONP
  var elem = document.createElement('script')
  elem.setAttribute('type', 'text/javascript')
  elem.setAttribute('src', url + '?jsonp=Example.display')
  document.body.appendChild(elem)
}

// a simple JBST controller
var Example = window.Example = {
  // current data (model)
  curData: null,
  curView: null,
  // curSort: { field: null, desc: false },

  // // table view templates
  // bandTable: null,
  // memberRow: null,

  // list view templates
  bandList: null,
  memberItem: null,

  display: function (data, view, field) { // JSON, JBST, string  data binding helper method
    // 'data' is just a pure JSON graph at this point
    if (data) {
      Example.curData = data
    }
    if (view) {
      Example.curView = view
    }

    if (!Example.curData || !Example.curView) {
      return
    }

    var demo = document.getElementById('ExampleArea')
    if (!demo) {
      return
    }
    // clear the demo area
    while (demo.lastChild) {
      demo.removeChild(demo.lastChild)
    }

    if (field) {
      Example.sort(field)
    }

    try {
      // combine the JSON and JBST to produce JsonML
      var jsonml = Example.curView.dataBind(Example.curData)

      // convert JsonML graph to DOM
      jsonml = JsonML.toHTML(jsonml)

      // display fully hydrated elements
      demo.appendChild(jsonml)
    } catch (ex) {
      demo.appendChild(document.createTextNode('Error: ' + ex.message))
    }
  },

  // sort: function (field) { // string  data sorting helper method
  //   if (!Example.curData || !field) {
  //     return
  //   }

  //   // set to ascending if changing, or toggle if same
  //   Example.curSort.desc = (Example.curSort.field === field) && !Example.curSort.desc
  //   Example.curSort.field = field

  //   function compare (a, b) { // object, object
  //     a = a[field]
  //     b = b[field]

  //     var aIsEmpty = (typeof a === 'undefined' || a === null)
  //     var bIsEmpty = (typeof b === 'undefined' || b === null)
  //     if (aIsEmpty) {
  //       return bIsEmpty ? 0 : 1
  //     }
  //     if (bIsEmpty) {
  //       return aIsEmpty ? 0 : -1
  //     }

  //     if (a instanceof Array) {
  //       a = a.join(',')
  //     }
  //     if (b instanceof Array) {
  //       b = b.join(',')
  //     }

  //     if (a < b) {
  //       return -1
  //     }
  //     if (a > b) {
  //       return 1
  //     }
  //     return 0
  //   }

  //   function reverse (a, b) { // object, object
  //     return -compare(a, b)
  //   }

  //   Example.curData.members = Example.curData.members.sort(Example.curSort.desc ? reverse : compare)
  // },
}

Example.display(null, bandList)
