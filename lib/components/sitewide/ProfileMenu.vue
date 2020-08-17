<template lang="pug">
v-menu(v-if="loggedIn")
  //- Show account stuff and logout
  v-btn(flat slot="activator")
    v-avatar
      img(alt="avatar" :src="userAvatar")

  v-list
    v-list-tile
      v-list-tile-avatar
        img(alt="avatar" :src="userAvatar")
      v-list-tile-title {{ userName }}

    v-list-tile(@click="revokeAccessAndLogout()")
      v-tooltip(left)
        | Removes the permission you granted to Paperize upon sign-in. No data will be lost.
        v-list-tile-title(slot="activator") Revoke Google Access &amp; Sign Out

    v-list-tile(@click="logout()")
      v-list-tile-title Sign Out

log-in-button(v-else) Sign In
</template>

<script>
  import { mapGetters } from 'vuex'
  import LogInButton from '../threshold/LogInButton.vue'

  export default {
    components: { LogInButton },

    computed: {
      ...mapGetters([
        'loggedIn',
        'userName',
        'userAvatar'
      ])
    },
  }
</script>
