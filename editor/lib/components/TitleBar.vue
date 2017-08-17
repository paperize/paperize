<template lang="pug">
.grid-container
  .grid-x
    .top-bar.small-12.cell
      .top-bar-left
        ul.menu
          li
            router-link(:to="{ name: homeLink }")
              strong Paperize.io
          li.build-status
            a(target="_blank" href="https://gist.github.com/lorennorman/9d0f3d7df597756a3bc14de4288e7c45") Alpha 1
      .top-bar-right
        profile-component
</template>

<script>
  import Profile from './Profile.vue'
  import FoundationMixin from '../mixins/foundation'

  export default {
    mixins: [FoundationMixin],
    components: {
      "profile-component": Profile
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
