const fs = require('fs')
const Parser = require('ejsonml-parser')

const templateRE = /\.html*$/i
function parse (config) {
  if (config.watch) {
    fs.watch(config.template, {
      persistent: true,
      interval: 20000,
      encoding: 'utf8',
      recursive: true,
    }, function (event, filename) {
      if (filename && event === 'change') {
        parseFile(filename, config)
      }
    })
  }
  fs.readdir(config.template, {
    encoding: 'utf8',
  }, (err, files) => {
    if (err) {
      throw err
    }
    files.forEach((filename) => {
      parseFile(filename, config)
    })
  })
}

function parseFile (filename, config) {
  if (!templateRE.test(filename)) {
    return
  }
  console.log(filename)
  let output = filename.replace(templateRE, '.js')
  output = config.output + '/' + output
  filename = config.template + '/' + filename
  hjsonParse(filename, output)
}

function hjsonParse (input, output) {
  const template = fs.readFileSync(input, 'utf8')
  const parser = new Parser(template)
  let hjson = parser.parse()
  hjson = JSON.stringify(hjson)
  hjson = toJs(hjson)
  fs.writeFileSync(output, hjson)
}

function toJs (hjson) {
  return 'module.exports='
    + hjson.replace(/(,|:|\[)"(function\(\$,_\){return .+?})"(,|]|})/g, '$1$2$3')
    + ';'
}

module.exports = parse
