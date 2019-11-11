/* global require module */
const
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  KEYS = require('./.api_keys.dev.json')

module.exports = (env={}) => {
  env.KEYS = KEYS
  return merge(common(env), {
    mode: 'development',
  })
}
