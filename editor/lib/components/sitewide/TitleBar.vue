<template lang="pug">
v-toolbar(app)
  v-toolbar-title
    router-link(:to="{ name: homeLink }") Paperize.io

    v-tooltip
      span.caption(slot="activator")= " ver.A6.0.4"
      | Alpha 6 "Enigmatic Gambler " {{ gitSha }}

  v-spacer

  v-toolbar-items
    template(v-if="loggedIn")
      errors-menu

      v-btn(flat @click="showDriveExplorer = true") Drive Explorer
      v-dialog(v-model="showDriveExplorer" @close-dialog="showDriveExplorer = false" max-width="500" lazy)
        drive-explorer

      v-btn(flat @click="showDatabaseManager = true") Database
      v-dialog(v-model="showDatabaseManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        database-manager

      v-btn(flat @click="showNetworkManager = true")
        = "Network "
        v-progress-circular(v-if="showSpinner" indeterminate color="primary")
      v-dialog(v-model="showNetworkManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        network-manager

    help-menu
    profile-menu
    print-status
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ProfileMenu from './ProfileMenu.vue'
  import HelpMenu from './HelpMenu.vue'
  import ErrorsMenu from './ErrorsMenu.vue'
  import DriveExplorer from '../drive/DriveExplorer.vue'
  import PrintStatus from '../print/PrintStatus.vue'
  import DatabaseManager from '../database/DatabaseManager.vue'
  import NetworkManager from '../network/NetworkManager.vue'

  export default {
    components: {
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
        gitSha: process.env.GIT_SHA,
        gitChanges: process.env.GIT_CHANGE_INFO,
        showDriveExplorer: false,
        showDatabaseManager: false,
        showNetworkManager: false,
      }
    },

    computed: {
      ...mapGetters(["loggedIn", "showSpinner"]),

      homeLink () {
        return this.loggedIn ? 'gameManager' : 'splash'
      }
    },

    methods: mapActions(["saveToDrive"])
  }
</script>
