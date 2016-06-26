const fs = require('fs')
const Parser = require('ejsonml-parser')
const EjmlParser = require('ejsonml-parser-javascript')

let jml
const parser = new Parser()
const ejmlParser = new EjmlParser({
  callback (j) {
    jml = j
  },
})
parser.install(ejmlParser)

const formatPrefix = {
  'es6': 'export default ',
  'cjs': 'module.exports=',
}
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
  let prefix = formatPrefix[config.format || 'es6']
  jmlParse(filename, output, prefix)
}

function jmlParse (input, output, prefix) {
  const template = fs.readFileSync(input, 'utf8')
  parser.parse(template)
  saveJml(prefix + jml, output)
}

function saveJml (jml, output) {
  fs.writeFileSync(output, jml)
}

module.exports = parse
