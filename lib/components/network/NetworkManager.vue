<template lang="pug">
v-card
  v-toolbar

    v-toolbar-title.text-center Network Manager

  v-list(subheader two-line)
    v-subheader Outstanding Network Requests
    v-list-item(v-for="request in trackedRequests" :key="request.id")
      v-list-item-avatar
        v-progress-circular(v-if="showSpinner" indeterminate color="primary")
      v-list-item-content
        v-list-item-title {{ request.name }}
        v-list-item-subtitle {{ request.details }}

    v-subheader Completed Network Requests
    v-list-item(v-for="request in completedRequests" :key="request.id")
      v-list-item-content
        v-list-item-title {{ request.name }}
        v-list-item-subtitle {{ request.details }}
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: mapGetters(["showSpinner", "trackedRequests", "completedRequests"])
  }
</script>
