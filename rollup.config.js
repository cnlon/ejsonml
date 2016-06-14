import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const name = 'ejsonml-render'
const fileName = 'ejsonml.render'
const moduleName = 'ejsonml_render'
const needMin = !!process.env.MIN

var dest = 'dist/' + fileName + '.js'
var plugins = [
  babel({
    presets: [ 'es2015-rollup' ],
  }),
]
if (needMin) {
  dest = 'dist/' + fileName + '.min.js'
  plugins.push(uglify({
    output: {
      comments: function (node, comment) {
        var text = comment.value
        var type = comment.type
        if (type === 'comment2') { // multiline comment
          return /MIT Licensed/.test(text)
        }
      },
    },
  }))
}

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleId: moduleName,
  moduleName: moduleName,
  dest,
  plugins,
  banner:
`/**
 * ${name} --- By longhao <longhaohe@gmail.com> (http://longhaohe.com/)
 * Github: https://github.com/longhaohe/${name}
 * MIT Licensed.
 */`,
}
