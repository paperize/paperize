/* global require module */
const
  merge = require('webpack-merge'),
  common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
})
