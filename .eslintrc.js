module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/strongly-recommended"
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "spread": true,
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "no-console": [
      "error",
      { "allow": [ "log", "warn", "error" ] }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "semi": [
      "error",
      "never"
    ]
  }
};
