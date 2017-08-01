<template lang="pug">
.top-bar
  .top-bar-left
    ul.menu
      li
        router-link(:to="{ name: 'splash' }")
          strong Paperize.io
  .top-bar-right
    ul.menu
      li
        profile-component
</template>

<script>
  import Profile from './Profile.vue'

  export default {
    data: () => {
      return {}
    },
    components: {
      "profile-component": Profile
    }
  }
</script>

<style>

</style>
