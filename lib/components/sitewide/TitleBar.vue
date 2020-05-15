<template lang="pug">
v-toolbar(app)
  v-toolbar-title
    router-link(:to="{ name: homeLink }") Paperize.io

    v-tooltip
      span.caption(slot="activator")= " ver.A7.3.1-experimental"
      | Alpha 7 "Obedient Consumer" {{ gitSha }} Experimental PNG rendering

  v-spacer

  v-toolbar-items
    template(v-if="loggedIn")
      errors-menu

      template(v-if="notProduction")
        v-btn(flat @click="showDebugMenu = true") Debug
        v-dialog(v-model="showDebugMenu" @close-dialog="showDebugMenu = false" max-width="500" lazy)
          debug-menu

      v-btn(flat @click="showDriveExplorer = true") Drive Explorer
      v-dialog(v-model="showDriveExplorer" @close-dialog="showDriveExplorer = false" max-width="500" lazy)
        drive-explorer

      v-btn.database-button(flat @click="showDatabaseManager = true") Database
      v-dialog(v-model="showDatabaseManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        database-manager

      v-btn(flat @click="showNetworkManager = true")
        = "Network "
        v-progress-circular(:size="16" :width="3" :class="{ invisible: !showSpinner }" indeterminate color="primary")
      v-dialog(v-model="showNetworkManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        network-manager

    help-menu
    profile-menu
    print-status
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import DebugMenu from './DebugMenu.vue'
  import ProfileMenu from './ProfileMenu.vue'
  import HelpMenu from './HelpMenu.vue'
  import ErrorsMenu from './ErrorsMenu.vue'
  import DriveExplorer from '../drive/DriveExplorer.vue'
  import PrintStatus from '../print/PrintStatus.vue'
  import DatabaseManager from '../database/DatabaseManager.vue'
  import NetworkManager from '../network/NetworkManager.vue'

  export default {
    components: {
      DebugMenu,
      ProfileMenu,
      HelpMenu,
      ErrorsMenu,
      DatabaseManager,
      PrintStatus,
      DriveExplorer,
      NetworkManager,
    },

    data() {
      return {
        notProduction: process.env.NODE_ENV !== "production",
        gitSha: process.env.GIT_SHA,
        gitChanges: process.env.GIT_CHANGE_INFO,
        showDebugMenu: false,
        showDriveExplorer: false,
        showDatabaseManager: false,
        showNetworkManager: false,
      }
    },

    computed: {
      ...mapGetters([ "loggedIn", "showSpinner" ]),

      homeLink () {
        return this.loggedIn ? 'gameManager' : 'splash'
      }
    },

    methods: mapActions([ "saveToDrive" ])
  }
</script>

<style scoped>
  .v-progress-circular {
    position: absolute;
    margin-top: 1em;
  }

  .invisible {
    visibility: hidden
  }
</style>
