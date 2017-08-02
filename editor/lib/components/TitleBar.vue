<template lang="pug">
.grid-container
  .grid-x
    .top-bar.small-12.cell
      .top-bar-left
        ul.menu
          li
            router-link(:to="{ name: homeLink }")
              strong Paperize.io
      .top-bar-right
        ul.menu.dropdown(data-dropdown-menu)
          li
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

</style>
