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

    v-list-tile(@click="logout()")
      v-list-tile-title Sign Out

v-btn(v-else flat color="success" @click.stop="prepareForLogin") Sign In
  //- Show login flow
  v-dialog(v-model="showPopupHelper" max-width="500" lazy)
    v-card(v-if="!loginError")
      v-card-title(primary-title)
        .headline Logging In With Google...
      v-card-text Look for a pop-up window asking for your Google login and follow the instruction.

    v-card(v-else)
      v-card-title(primary-title)
        .headline Error Logging In
      v-card-text
        v-alert(type="error" :value="true") {{ errorCodeInEnglish }}

      v-card-actions
        v-btn(@click="login") Try Again
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  const ERROR_CODE_MAP = {
    popup_closed_by_user: "You closed the pop-up without logging in.",
    popup_blocked_by_browser: "Your browser blocked the login pop-up. Enable pop-ups for this site and try again!",
    access_denied: "You denied Paperize access to the required scopes. Paperize cannot run without a linked Google account.",
  }

  export default {
    data() {
      return {
        showPopupHelper: false
      }
    },

    computed: {
      ...mapGetters(['loggedIn', 'loginError', 'userName', 'userAvatar']),

      errorCodeInEnglish() {
        return ERROR_CODE_MAP[this.loginError] || `There was an unknown error logging in: ${this.loginError}`
      }
    },

    methods: {
      ...mapActions(["login", "logout"]),

      prepareForLogin() {
        // Helpful information inside our app about the Google login process
        this.showPopupHelper = true
        // Start the Google login process
        return this.login()
      },
    }
  }
</script>
