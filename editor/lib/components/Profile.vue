<template lang="pug">
li.authenticated(v-if="authenticated")
  a.avatar
    img(alt="avatar" :src="profile.avatarSrc")
  ul.menu
    li.name {{ profile.name }}
    li
      a(@click="logout()") Sign Out
li.unauthenticated(v-else)
  a(@click="login()") Sign In
  ul.menu
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import FoundationMixin from '../mixins/foundation'

  export default {
    mixins: [FoundationMixin],
    updated () { $(this.$el).foundation() },
    computed: mapState(['authenticated', 'profile']),
    methods: {
      ...mapActions(['login']),
      logout() {
        this.$store.commit("logout")
        this.$router.push({ name: 'splash' })
      }
    }
  }
</script>

<style scoped>
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
