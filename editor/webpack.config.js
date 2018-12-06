/* global require, __dirname, module */
var webpack = require('webpack')
  , CopyWebpackPlugin = require('copy-webpack-plugin')
  , VueLoaderPlugin = require('vue-loader/lib/plugin')
  , path = require('path')
  , shell = require('shelljs')

var gitSha = shell.exec("git log --pretty=format:'%h' -n 1").stdout
  , gitChanges = shell.exec("git diff --stat").stdout.trim()

if(gitChanges.length == 0) {
  gitChanges = "Clean checkout of " + gitSha

} else {
  gitChanges = gitChanges.split("\n")
  gitChanges = gitChanges[gitChanges.length-1]

  var diffLines = gitChanges.split(", ")
  if(diffLines[1]){
    gitSha += "+" + parseInt(diffLines[1])
  }
  if(diffLines[2]){
    gitSha += "-" + parseInt(diffLines[2])
  }
}

module.exports = {
  entry: './lib/main.js',
  output: {
    filename: 'editor.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'GIT_SHA': gitSha,
      'GIT_CHANGE_INFO': gitChanges
    }),

    new CopyWebpackPlugin([
      { context: 'static', from: '**' }
    ]),

    new VueLoaderPlugin()
  ],
  module: {
    noParse: /file-api/,
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }, {
        test: /\.vue$/,
        exclude: /(node_modules)/,
        loader: 'vue-loader'
      }, {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      }, {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader'
          }, {
            loader: 'css-loader'
          }
        ]
      }
    ]
  }
}
