<template lang="pug">
  v-tooltip(v-if="spreadsheet" top)
    v-btn.refresh-spreadsheet(slot="activator" fab small @click="refreshSheetIndex(spreadsheet.id)")
      v-icon refresh
    p Refresh Spreadsheet from Drive
    | (last refresh: {{ lastRefresh }})
</template>

<script>
  import moment from 'moment'

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
