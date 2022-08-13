<template lang="pug">
v-dialog(v-model="printStatusWindowOpen" @close-dialog="printStatusWindowOpen = false" max-width="500")
  v-card.image-library
    v-card-title
      .headline Print In Progress...

    v-card-text
      p(style="margin-bottom: 5px;" v-for="line in status") {{ line }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(["printJobStatus", "statusWindowOpen"]),

    status() {
      return this.printJobStatus.split('\n')
    },

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
