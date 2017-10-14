<template lang="pug">
ul.menu.dropdown.authenticated(v-if="user.authenticated" data-dropdown-menu)
  li
    a.avatar
      img(v-if="renderAvatar()" alt="avatar" :src="user.avatarSrc")
    ul.menu
      li.name {{ user.name }}
      li
        a(@click="logout()") Sign Out

ul.menu.unauthenticated(v-else)
  li
    a(@click='login()') Sign In
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import auth from '../../auth'

  export default {
    updated() {
      try {
        $(this.$el).foundation("destroy")
      } catch(error) {}
      $(this.$el).foundation()
    },
    computed: mapState(['user']),
    methods: {
      ...mapActions(["login", "logout"]),

      renderAvatar() {
        return process.env.NODE_ENV != 'test' &&
          this.user.avatarSrc &&
          this.user.avatarSrc.length > 0
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
