/* global require module process */
const
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  KEY_FILE_LOCATION = './.api_keys.dev.json'

let KEYS

// Make a nice help message for new contributors who haven't set up their API Keys yet
try {
  KEYS = require(KEY_FILE_LOCATION)
} catch(error) {
  if(error.message.indexOf(`Cannot find module '${KEY_FILE_LOCATION}'`) > -1) {
    console.error(`Error:
      Expected to find an API key file at ${KEY_FILE_LOCATION}
      Did you complete the API Keys step in the README?
    `)
    process.exit(1)
  } else {
    throw error
  }
}

module.exports = (env={}) => {
  env.KEYS = KEYS
  return merge(common(env), {
    mode: 'development',
  })
}
