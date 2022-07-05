<template lang="pug">
v-dialog(v-model="printStatusWindowOpen" @close-dialog="printStatusWindowOpen = false" max-width="500")
  v-card.image-library
    v-card-title
      .headline Print In Progress...

    v-card-text
      pre {{ printJobStatus }}
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(["printJobStatus", "statusWindowOpen"]),

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
