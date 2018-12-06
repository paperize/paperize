<template lang="pug">
v-card
  v-toolbar

    v-toolbar-title.text-xs-center Network Manager

  v-list(subheader two-line)
    v-subheader Outstanding Network Requests
    v-list-tile(avatar v-for="request in trackedRequests" :key="request.id")
      v-list-tile-avatar
        v-progress-circular(v-if="showSpinner" indeterminate color="primary")
      v-list-tile-content
        v-list-tile-title {{ request.name }}
        v-list-tile-sub-title {{ request.details }}

    v-subheader Completed Network Requests
    v-list-tile(v-for="request in completedRequests" :key="request.id")
      v-list-tile-content
        v-list-tile-title {{ request.name }}
        v-list-tile-sub-title {{ request.details }}
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: mapGetters(["showSpinner", "trackedRequests", "completedRequests"])
  }
</script>
