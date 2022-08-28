<template lang="pug">
div
  h3 Export Log
  p(v-for="line in logLines") {{ line }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  updated() {
    if(!this.$el) { return }

    this.$el.scrollTop = this.$el.scrollHeight
  },

  props: [ "exportType", "compact" ],

  computed: {
    ...mapGetters(["exportItemStatus", "exportGameStatus"]),

    logLines() {
      const status = (this.exportType === 'item')
        ? this.exportItemStatus
        : this.exportGameStatus

      return status.split('\n')
    },

    maxHeight() { return this.compact ? '160px' : '70vh' }
  }
}
</script>

<style scoped>
div {
  max-height: v-bind(maxHeight);
  overflow-y: auto;
}

p {
  margin-bottom: 5px;
  font-size: 12px;
}
</style>
