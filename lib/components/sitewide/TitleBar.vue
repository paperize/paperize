<template lang="pug">
v-app-bar
  v-toolbar-title
    router-link(:to="{ name: homeLink }") Paperize.io

    v-tooltip(bottom)
      template(v-slot:activator="{ on }")
        span.caption(v-on="on")= " ver.A8.7.1"
      | Alpha 8 "Personal Space" {{ gitSha }}

  v-spacer

  v-toolbar-items
    template(v-if="loggedIn")
      errors-menu

      template(v-if="!isProduction")
        v-btn(text @click="showDebugMenu = true") Debug
        v-dialog(v-model="showDebugMenu" @close-dialog="showDebugMenu = false" max-width="500")
          debug-menu

      v-btn(text @click="showDriveExplorer = true") Drive Explorer
      v-dialog(v-model="showDriveExplorer" @close-dialog="showDriveExplorer = false" max-width="500")
        drive-explorer

      v-btn.database-button(text @click="showDatabaseManager = true") Database
      v-dialog(v-model="showDatabaseManager" @close-dialog="showDatabaseManager = false" max-width="500")
        database-manager

      v-btn(text @click="showNetworkManager = true")
        = "Network "
        v-progress-circular(:size="16" :width="3" :class="{ invisible: !showSpinner }" indeterminate color="primary")
      v-dialog(v-model="showNetworkManager" @close-dialog="showDatabaseManager = false" max-width="500")
        network-manager

    help-menu
    v-btn(text icon @click="setDarkMode(!darkMode)" :class="{'toggle-on': darkMode, 'toggle-off': !darkMode}")
      v-icon mdi-brightness-6
    profile-menu
    export-status
</template>

<script>
import { mapGetters } from 'vuex'
import DebugMenu from './DebugMenu.vue'
import ProfileMenu from './ProfileMenu.vue'
import HelpMenu from './HelpMenu.vue'
import ErrorsMenu from './ErrorsMenu.vue'
import DriveExplorer from '../drive/DriveExplorer.vue'
import ExportStatus from '../print/ExportStatus.vue'
import DatabaseManager from '../database/DatabaseManager.vue'
import NetworkManager from '../network/NetworkManager.vue'

export default {
  components: {
    DebugMenu,
    ProfileMenu,
    HelpMenu,
    ErrorsMenu,
    DatabaseManager,
    ExportStatus,
    DriveExplorer,
    NetworkManager,
  },

  data() {
    return {
      gitSha: import.meta.env.VITE_GIT_SHA || "Unknown Git SHA",
      showDebugMenu: false,
      showDriveExplorer: false,
      showDatabaseManager: false,
      showNetworkManager: false,
    }
  },

  computed: {
    ...mapGetters([ "loggedIn", "showSpinner", "isProduction" ]),

    darkMode() { return this.$vuetify.theme.dark },

    homeLink () {
      return this.loggedIn ? 'gameManager' : 'splash'
    }
  },

  methods: {
    setDarkMode(isDark) { this.$vuetify.theme.dark = isDark }
  }
}
</script>

<style scoped>
  .v-app-bar {
    max-height: 64px;
  }

  .v-progress-circular {
    position: absolute;
    margin-top: 1em;
  }

  .invisible {
    visibility: hidden
  }

  .toggle-on {
    animation-name: turn-up;
    transform: rotate(180deg);
    animation-duration: 300ms;
    animation-timing-function: ease-in-out;
  }

  .toggle-off {
    animation-name: turn-down;
    transform: rotate(  0deg);
    animation-duration: 300ms;
    animation-timing-function: ease-in-out;
  }

  @keyframes turn-up {
    from {
      transform: rotate(  0deg);
    }

    to {
      transform: rotate(180deg);
    }
  }

  @keyframes turn-down {
    from {
      transform: rotate(180deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
