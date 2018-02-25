/* global require, __dirname, module */
var webpack = require('webpack')
  , CopyWebpackPlugin = require('copy-webpack-plugin')
  , path = require('path')
  , shell = require('shelljs')

var gitSha = shell.exec("git log --pretty=format:'%h' -n 1").stdout
  , gitChanges = shell.exec("git diff --stat").stdout.trim()

gitChanges = gitChanges.split("\n")
gitChanges = gitChanges[gitChanges.length-1]
gitSha += "+" + parseInt(gitChanges.split(", ")[1])
gitSha += "-" + parseInt(gitChanges.split(", ")[2])

module.exports = {
  entry: './lib/main.js',
  output: {
    filename: 'editor.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'NODE_ENV': 'development',
      'GIT_SHA': gitSha,
      'GIT_CHANGE_INFO': gitChanges
    }),

    new CopyWebpackPlugin([
      { context: 'static', from: '**' }
    ])
  ],
  module: {
    noParse: /\/file-api\//,
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }, {
        test: /\.vue$/,
        exclude: /(node_modules)/,
        loader: 'vue-loader'
      }
    ]
  }
}
