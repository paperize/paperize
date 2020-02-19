/* global require */
const
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  KEYS = require('./.api_keys.prod.json')

module.exports = (env={}) => {
  env.KEYS = KEYS
  return merge(common(env), {
    mode: 'production',
    devtool: 'source-map',
  })
}
