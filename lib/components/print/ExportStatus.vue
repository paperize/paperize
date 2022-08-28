<template lang="pug">
v-dialog(v-model="printStatusWindowOpen" @close-dialog="printStatusWindowOpen = false" max-width="500")
  v-card.image-library
    v-card-title
      .headline Exporting...

    v-card-text
      export-log(export-type="game")
</template>

<script>
import { mapGetters } from 'vuex'
import ExportLog from './ExportLog.vue'

export default {
  components: { ExportLog },

  computed: {
    ...mapGetters(["statusWindowOpen"]),

    printStatusWindowOpen: {
      get() {
        return this.statusWindowOpen
      },

      set(newValue) {
        this.$store.commit("setStatusWindowOpen", newValue)
      }
    }
  }
}
</script>
