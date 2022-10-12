<template lang="pug">
v-menu(v-if="loggedIn")
  //- Show account stuff and logout
  template(v-slot:activator="{ on }")
    v-btn(text v-on="on")
      v-avatar
        img(alt="avatar" :src="userAvatar")

  v-list
    v-list-item
      v-list-item-avatar
        img(alt="avatar" :src="userAvatar")
      v-list-item-title {{ userName }}

    v-list-item(@click="revokeAccessAndLogout()")
      v-tooltip(left)
        | Removes the permission you granted to Paperize upon sign-in. No data will be lost.
        template(v-slot:activator="{ on }")
          v-list-item-title(v-on="on") Revoke Google Access &amp; Sign Out

    v-list-item(@click="logout()")
      v-list-item-title Sign Out

v-btn.log-in-button(v-else text color="success" @click.stop="prepareForLogin") Sign In
  //- Show login flow
  v-dialog(v-model="showPopupHelper" max-width="500")
    v-card(v-if="!loginError")
      v-card-title(primary-title)
        .headline Logging In With Google...
      v-card-text
        p Look for a pop-up window asking for your Google login and follow the instructions.
        template(v-if="showSpinner")
          v-progress-circular(indeterminate color="primary")
        pre {{ loginStatus }}

    v-card(v-else)
      v-card-title(primary-title)
        .headline Error Logging In
      v-card-text
        v-alert(type="error") {{ errorCodeInEnglish }}

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
    ...mapGetters([
      'loggedIn',
      'loginStatus',
      'loginError',
      'showSpinner',
      'userName',
      'userAvatar'
    ]),

    errorCodeInEnglish() {
      return ERROR_CODE_MAP[this.loginError] || `There was an unknown error logging in: ${this.loginError}`
    }
  },

  methods: {
    ...mapActions(["login", "logout", "revokeAccessAndLogout"]),

    prepareForLogin() {
      // Helpful information inside our app about the Google login process
      this.showPopupHelper = true
      // Start the Google login process
      return this.login().then(() => {
        if(!this.loginError) {
          // Don't hide if there was an error to see
          this.showPopupHelper = false
        }
      })
    },
  }
}
</script>
