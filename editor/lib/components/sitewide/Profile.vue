<template lang="pug">
v-menu(v-if="user.authenticated")
  v-btn(flat slot="activator")
    v-avatar
      img(alt="avatar" :src="avatarSrc")

  v-list
    v-list-tile
      v-list-tile-avatar
        img(alt="avatar" :src="avatarSrc")
      v-list-tile-title {{ user.name }}

    v-list-tile(@click="$modal.show('Database Manager')")
      v-list-tile-title Database

    v-list-tile(@click="logout()")
      v-list-tile-title Sign Out

v-btn(v-else flat color="success" @click='prepareForLogin') Sign In
  //- TODO: fix google helper modal
  //-     h1(v-if="!loginError") Logging In With Google...
  //-     h1(v-else) Error Logging In:
  //-     hr
  //-
  //-     .callout.primary(v-if="!loginError")
  //-       p Look for a pop-up window asking for your Google login and follow the instruction.
  //-
  //-     .callout.alert(v-else-if="loginError == 'popup_closed_by_user'")
  //-       p You closed the pop-up without logging in.
  //-
  //-     .callout.alert(v-else-if="loginError == 'popup_blocked_by_browser'")
  //-       p Your browser blocked the login pop-up. Enable pop-ups for this site and try again!
  //-
  //-     .callout.alert(v-else-if="loginError == 'access_denied'")
  //-       p You denied Paperize access to the required scopes. Paperize cannot run without a linked Google account.
  //-
  //-     .callout.alert(v-else)
  //-       p There was an unknown error logging in: {{ loginError }}
  //-
  //-   .small-12.cell(v-if="loginError")
  //-     a.button(@click="login") Try Again
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import auth from '../../auth'

  export default {
    data() {
      return {
        showPopupHelper: true
      }
    },

    computed: {
      ...mapState(['user']),

      ...mapGetters(['loginError']),

      avatarSrc() {
        return this.user.avatarSrc || "/images/blank-avatar.png"
      }
    },

    methods: {
      ...mapActions(["login", "logout"]),

      prepareForLogin() {
        // this.$modal.show("Google Pop-up Helper")
        // this.showPopupHelper = true
        return this.login()
      },
    }
  }
</script>

<style scoped>
  .dropdown.menu > li.is-dropdown-submenu-parent > a::after {
    display: none;
  }

  .menu.dropdown .avatar {
    padding: 0;
  }

  .name {
    padding: .7rem 1rem;
    font-weight: bold;
  }

  .avatar img {
    max-width: 40px;
    max-height: 40px;
    border-radius: 50px;
  }
</style>
