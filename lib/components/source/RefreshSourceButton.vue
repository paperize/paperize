<template lang="pug">
v-tooltip(v-if="spreadsheet" top)
  template(v-slot:activator="{ on }")
    v-btn.refresh-spreadsheet(v-on="on" fab small @click="refreshSheetIndex(spreadsheet.id)")
      v-icon refresh
  p Refresh Spreadsheet from Drive
  | (last refresh: {{ lastRefresh }})
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'

export default {
  props: ["spreadsheet"],

  computed: {
    lastRefresh() {
      return moment(this.spreadsheet.refreshedAt).fromNow()
    },
  },

  methods: mapActions(["refreshSheetIndex"])
}
</script>
