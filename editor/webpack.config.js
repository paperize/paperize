var webpack = require('webpack')
  , CopyWebpackPlugin = require('copy-webpack-plugin')
  , path = require('path')

module.exports = {
  entry: './lib/main.js',
  output: {
    filename: 'editor.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.EnvironmentPlugin({'NODE_ENV': 'development'}),
    new CopyWebpackPlugin([
      { context: 'static', from: '**'}
    ])
  ],
  module: {
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
};
