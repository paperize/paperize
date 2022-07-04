<template lang="pug">
v-app
  //- v-navigation-drawer(app mini-variant)
  title-bar

  v-content
    router-view

  v-footer(app)
    v-layout(row)
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
