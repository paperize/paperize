<template lang="pug">
div(v-if="user.authenticated")
  ul.menu.dropdown.authenticated(data-dropdown-menu)
    li
      a(@click="$modal.show('Image Library')") Images
    li
      a.avatar
        img(alt="avatar" :src="avatarSrc")
      ul.menu
        li.name {{ user.name }}
        li
          a(@click="$modal.show('Database Manager')") Database
        li
          a(@click="logout()") Sign Out

div(v-else)
  ul.menu.unauthenticated
    li
      a(@click='prepareForLogin') Sign In

  modal(name="Google Pop-up Helper")
    .grid-x.grid-padding-x
      .small-12.cell
        h1(v-if="!loginError") Logging In With Google...
        h1(v-else) Error Logging In:
        hr

        .callout.primary(v-if="!loginError")
          p Look for a pop-up window asking for your Google login and follow the instruction.

        .callout.alert(v-else-if="loginError == 'popup_closed_by_user'")
          p You closed the pop-up without logging in.

        .callout.alert(v-else-if="loginError == 'popup_blocked_by_browser'")
          p Your browser blocked the login pop-up. Enable pop-ups for this site and try again!

        .callout.alert(v-else-if="loginError == 'access_denied'")
          p You denied Paperize access to the required scopes. Paperize cannot run without a linked Google account.

        .callout.alert(v-else)
          p There was an unknown error logging in: {{ loginError }}

      .small-12.cell(v-if="loginError")
        a.button(@click="login") Try Again
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import auth from '../../auth'

  export default {
    updated() {
      try {
        $(this.$el).foundation("destroy")
      } catch(error) {}
      $(this.$el).foundation()
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
        this.$modal.show("Google Pop-up Helper")
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
