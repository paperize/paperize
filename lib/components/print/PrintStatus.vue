<template lang="pug">
v-dialog(v-model="printStatusWindowOpen" @close-dialog="printStatusWindowOpen = false" max-width="500")
  v-card.image-library
    v-card-title
      .headline Print In Progress...

    v-card-text
      print-log(export-type="game")
</template>

<script>
import { mapGetters } from 'vuex'
import PrintLog from './PrintLog.vue'

export default {
  components: { PrintLog },

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
