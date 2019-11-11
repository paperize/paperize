/* global process module */
module.exports = {
  getKey: (namespace, key_name) => {
    return process.env.KEYS[namespace][key_name]
  }
}
