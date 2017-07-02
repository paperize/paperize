<template lang="pug">
.top-bar
  .row
    .columns.small-12
      .top-bar-title
        p
          router-link(to="/")
            strong Paperize.io
      div
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
