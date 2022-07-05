<template lang="pug">
v-app
  //- v-navigation-drawer(app mini-variant)
  title-bar

  v-main
    router-view

  v-footer(app)
    v-layout
      v-btn(text href="/privacy-policy.html") Privacy Policy
      v-spacer
</template>

<script>
  import TitleBar from '../sitewide/TitleBar.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: { TitleBar }
  }
</script>
