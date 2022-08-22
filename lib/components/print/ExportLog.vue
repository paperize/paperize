<template lang="pug">
div
  p(v-for="line in logLines") {{ line }}
</template>

<script>
import { mapGetters } from 'vuex'

// TODO: make "compact" and "full" modes via prop
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
div {
  max-height: 100px;
  overflow-y: scroll;
}
p {
  color: lightgreen;
  margin-bottom: 5px;
  font-size: 12px;
}
</style>
