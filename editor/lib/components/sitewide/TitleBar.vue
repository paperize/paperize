<template lang="pug">
v-toolbar(app)
  v-toolbar-title
    router-link(:to="{ name: homeLink }") Paperize.io

    v-tooltip
      span.caption(slot="activator")= " ver.A5.1.2"
      | Alpha 5 "Reclusive Scrivener " {{ gitSha }}

  v-spacer

  v-toolbar-items
    template(v-if="loggedIn")
      v-btn(@click="showImageManager = true") Images
      v-dialog(v-model="showImageManager" @close-dialog="showImageManager = false" max-width="500" lazy)
        image-library

      v-btn(@click="showDatabaseManager = true") Database
      v-dialog(v-model="showDatabaseManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        database-manager

      v-btn(@click="showNetworkManager = true")
        = "Network "
        v-progress-circular(v-if="showSpinner" indeterminate color="primary")
      v-dialog(v-model="showNetworkManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        network-manager

    //- template(v-else)
    //-   v-btn(flat) About
    profile
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Profile from './Profile.vue'
  import ImageLibrary from '../image/ImageLibrary.vue'
  import DatabaseManager from '../database/DatabaseManager.vue'
  import NetworkManager from '../network/NetworkManager.vue'

  export default {
    components: { Profile, DatabaseManager, ImageLibrary, NetworkManager },

    data() {
      return {
        gitSha: process.env.GIT_SHA,
        gitChanges: process.env.GIT_CHANGE_INFO,
        showImageManager: false,
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
