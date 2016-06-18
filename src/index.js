import {
  toHTML as _toHTML,
} from './html'
import JBST from './jbst'

export default class JsonML {
  constructor (jml) {
    this.template = new JBST(jml)
  }
  dataBind (...args) {
    return this.template.dataBind(...args)
  }
  toHTML (...args) {
    return _toHTML(...args)
  }
  render (...args) {
    return _toHTML(this.template.dataBind(...args))
  }
}
