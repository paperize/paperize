<template lang="pug">
div
  p(style="margin-bottom: 5px;" v-for="line in logLines") {{ line }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [
    "exportType"
  ],

  computed: {
    ...mapGetters(["exportItemStatus", "exportGameStatus"]),

    logLines() {
      const status = (this.exportType === 'item')
        ? this.exportItemStatus
        : this.exportGameStatus

      return status.split('\n')
    }
  }
}
</script>

<style scoped>
p {
  font-size: 12px;
}
</style>
