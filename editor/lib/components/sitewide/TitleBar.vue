<template lang="pug">
v-toolbar(app)
  v-toolbar-side-icon

  router-link(:to="{ name: homeLink }")
    v-tooltip
      v-toolbar-title(slot="activator") Paperize.io
      | Alpha 4 "Prodigious Electromancer " {{ gitSha }}

  v-spacer

  v-toolbar-items.hidden-sm-and-down
    v-btn(flat) About
    v-btn(flat color="success") Login

//-   database-manager
//-   image-manager
//-   profile-component
</template>

<script>
  import Profile from './Profile.vue'
  import ImageManager from '../asset/ImageManager.vue'
  import DatabaseManager from '../database/DatabaseManager.vue'

  export default {
    components: {
      "profile-component": Profile,
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
