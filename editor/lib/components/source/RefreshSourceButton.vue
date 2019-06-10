<template lang="pug">
  v-tooltip(v-if="spreadsheet" top)
    v-btn(slot="activator" fab small @click="refreshSheetIndex(spreadsheet.id)")
      v-icon refresh
    span Refresh (last refresh: {{ lastRefresh }})
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
