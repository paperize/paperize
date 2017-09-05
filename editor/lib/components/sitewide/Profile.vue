<template lang="pug">
ul.menu.dropdown.authenticated(v-if="user.authenticated" data-dropdown-menu)
  li
    a.avatar
      img(alt="avatar" :src="user.avatarSrc")
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
      login() {
        let store = this.$store
        let router = this.$router
        auth.getAuth2((auth2) => {
          auth2.signIn().then(
            (googleUser) => {
              let idToken = googleUser.getBasicProfile().getEmail()
              store.dispatch("loadStateFromDB", { idToken })

              store.commit("setProfile", { profile: {
                  name:      googleUser.getBasicProfile().getName(),
                  email:     googleUser.getBasicProfile().getEmail(),
                  avatarSrc: googleUser.getBasicProfile().getImageUrl()
                }
              })

              router.push({ name: 'gameManager' })
            },

            (error) => {
              console.error("Sign in Error:", error)
            })
        })
      },

      logout() {
        this.$store.commit("logout")
        this.$router.push({ name: 'splash' })

        auth.getAuth2((auth2) => { auth2.signOut() })
      }
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
