<template lang="pug">
ul.menu.dropdown.authenticated(v-if="user.authenticated" data-dropdown-menu)
  li
    a(@click="openImageLibrary") Images
  li
    a.avatar
      img(alt="avatar" :src="avatarSrc")
    ul.menu
      li.name {{ user.name }}
      li
        a(@click="logout()") Sign Out

ul.menu.unauthenticated(v-else)
  li
    a(@click='login()') Sign In
</template>

<script>
  import { mapState, mapActions } from 'vuex'
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
      avatarSrc() {
        return this.user.avatarSrc || "/images/blank-avatar.png"
      }
    },

    methods: {
      ...mapActions(["login", "logout", "openImageLibrary"]),
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
