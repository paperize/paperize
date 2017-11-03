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
      { context: 'static', from: '**', transform: function(content, path) {
        // Set local/remote JS includes in the HTML based on environment
        if(path.includes("/static/index.html")) {
          var gapiInclude = ""

          if(process.env.NODE_ENV === 'production') {
            gapiInclude = "https://apis.google.com/js/api.js"
          } else {
            gapiInclude = "js/vendor/gapi.min.js"
          }

          return content.toString().replace("GAPI_SOURCE", gapiInclude)

        } else {
          return content
        }
      }}
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
