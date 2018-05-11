/* global require, module, __dirname */
var webpack = require('webpack')
  , path = require('path')

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './test/test.coffee',
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'test/build')
  },
  plugins: [
    new webpack.EnvironmentPlugin({'NODE_ENV': 'test'})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }, {
        test: /\.coffee$/,
        exclude: /(node_modules)/,
        loader: 'coffee-loader'
      }, {
        test: /\.vue$/,
        exclude: /(node_modules)/,
        loader: 'vue-loader'
      }
    ]
  }
}
