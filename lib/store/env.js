export default {
  getters: {
    isProduction: () => import.meta.env.PROD,
    isCypress: () => window?.Cypress,
    isTest: () => false,
    isDevelopment: () => import.meta.env.DEV,
  }
}
