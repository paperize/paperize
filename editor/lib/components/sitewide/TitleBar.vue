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
      v-btn(@click="showImageManager = true") Images
      v-dialog(v-model="showImageManager" @close-dialog="showImageManager = false" max-width="500" lazy)
        image-manager

      v-btn(@click="showDatabaseManager = true") Database
      v-dialog(v-model="showDatabaseManager" @close-dialog="showDatabaseManager = false" max-width="500" lazy)
        database-manager

    template(v-else)
      v-btn(flat) About
    login-btn
</template>

<script>
  import { mapGetters } from 'vuex'
  import Profile from './Profile.vue'
  import ImageManager from '../asset/ImageManager.vue'
  import DatabaseManager from '../database/DatabaseManager.vue'

  export default {
    components: {
      "login-btn": Profile,
      "database-manager": DatabaseManager,
      "image-manager": ImageManager
    },

    data() {
      return {
        gitSha: process.env.GIT_SHA,
        gitChanges: process.env.GIT_CHANGE_INFO,
        showImageManager: false,
        showDatabaseManager: false,
      }
    },

    computed: {
      ...mapGetters(["loggedIn"]),

      homeLink () {
        return this.loggedIn ? 'gameManager' : 'splash'
      }
    }
  }
</script>
