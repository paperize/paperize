<template lang="pug">
v-toolbar(app)
  v-toolbar-title
    router-link(:to="{ name: homeLink }") Paperize.io

    v-tooltip
      span.caption(slot="activator")= " ver.A4"
      | Alpha 4 "Prodigious Electromancer " {{ gitSha }}

  v-spacer

  v-toolbar-items
    template(v-if="loggedIn")
      v-progress-circular(v-if="showSpinner" indeterminate color="primary")
      v-btn(@click="showImageManager = true") Images
      v-dialog(v-model="showImageManager" @close-dialog="showImageManager = false" max-width="500" lazy)
        image-library

      v-btn(@click="showDatabaseManager = true") Database
      v-dialog(v-model="showDatabaseManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        database-manager

      v-btn(@click="saveToDrive") {{ saveButtonText }}

    template(v-else)
      v-btn(flat) About
    profile
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Profile from './Profile.vue'
  import ImageLibrary from '../image/ImageLibrary.vue'
  import DatabaseManager from '../database/DatabaseManager.vue'

  export default {
    components: { Profile, DatabaseManager, ImageLibrary },

    data() {
      return {
        gitSha: process.env.GIT_SHA,
        gitChanges: process.env.GIT_CHANGE_INFO,
        showImageManager: false,
        showDatabaseManager: false
      }
    },

    computed: {
      ...mapGetters(["loggedIn", "saving", "showSpinner"]),

      saveButtonText() {
        return this.saving ? "Saving..." : "Save"
      },

      homeLink () {
        return this.loggedIn ? 'gameManager' : 'splash'
      }
    },

    methods: mapActions(["saveToDrive"])
  }
</script>
