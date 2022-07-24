import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

// Detect the user's dark mode setting at the OS level
// https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches

const themeColors = {
  primary: colors.blueGrey.lighten2,
  secondary: colors.blueGrey.darken2,
}

export default new Vuetify({
  theme: {
    dark,
    themes: {
      dark: themeColors,
      light: themeColors
    }
  }
})
