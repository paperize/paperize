<template lang="pug">
v-toolbar(app)
  v-toolbar-side-icon

  v-toolbar-title
    router-link(:to="{ name: homeLink }") Paperize.io

    v-tooltip
      span.caption(slot="activator")= " ver.A4"
      | Alpha 4 "Prodigious Electromancer " {{ gitSha }}

  v-spacer
  //-   database-manager
  //-   image-manager

  v-toolbar-items
    v-btn(flat) About
    login-btn
</template>

<script>
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
        gitChanges: process.env.GIT_CHANGE_INFO
      }
    },

    computed: {
      homeLink () {
        return this.$store.state.authenticated ? 'gameManager' : 'splash'
      }
    }
  }
</script>

<style>
  .build-status {
    font-size: .8em;
    /*padding: .7rem 1rem;*/
  }
</style>
