export default {
  getters: {
    isProduction: () => process.env.NODE_ENV == "production",
    isCypress: () => window && window.Cypress,
    isTest: () => process.env.NODE_ENV == "test",
    isDevelopment: () => process.env.NODE_ENV == "development",
  }
}
