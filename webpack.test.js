/* global require */
const
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  { NormalModuleReplacementPlugin } = require('webpack')

module.exports = (env={}) => {
  env.KEYS = {}
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      new NormalModuleReplacementPlugin(
        /services\/google\/drive\.js/,
        '../../../cypress/mocks/drive.js'),
      new NormalModuleReplacementPlugin(
        /services\/google\/sheets\.js/,
        '../../../cypress/mocks/sheets.js'),
      new NormalModuleReplacementPlugin(
        /services\/google\/picker\.js/,
        '../../../cypress/mocks/picker.js'),
      new NormalModuleReplacementPlugin(
        /services\/keys\.js/,
        '../../cypress/mocks/keys.js'),
    ]
  })
}
