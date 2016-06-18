const fs = require('fs')
const Parser = require('ejsonml-parser')

function parse (config) {
  const template = fs.readFileSync(config.template, 'utf8')
  const parser = new Parser(template)
  let hjson = parser.parse()
  hjson = JSON.stringify(hjson)
  hjson = toJs(hjson)
  fs.writeFileSync(config.output, hjson)
}

function toJs (hjson) {
  return 'module.exports='
    + hjson.replace(/(,|:|\[)"(function\(\$,_,_\$\){return .+?})"(,|]|})/g, '$1$2$3')
    + ';'
}

module.exports = parse
