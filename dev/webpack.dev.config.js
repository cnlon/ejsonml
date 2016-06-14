var path = require('path')

var config = {
  entry: {
    app: './dev/index.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'dev.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  babel: {
    presets: [ 'es2015' ],
  },
  devtool: 'eval',
  resolve: {
    alias: {
      'ejsonml-render': path.resolve(__dirname, '../src/'),
      'ejsonml-parser': path.resolve(__dirname, '../../ejsonml-parser/lib/'),
    },
  },
}

module.exports = config
