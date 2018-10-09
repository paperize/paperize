<template lang="pug">
v-app
  v-navigation-drawer(app mini-variant)
  title-bar

  v-content
    v-container(fluid)
      router-view

  v-footer(app)
</template>

<script>
  import TitleBar from '../sitewide/TitleBar.vue'

  export default {
    components: {
      'title-bar': TitleBar
    }
  }
</script>
