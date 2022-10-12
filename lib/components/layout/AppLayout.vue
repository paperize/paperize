<template lang="pug">
v-app
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

export default {
  components: { TitleBar }
}
</script>
