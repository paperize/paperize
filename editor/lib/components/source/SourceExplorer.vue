<template lang="pug">
v-card.source-explorer
  v-card-title
      .headline Browse Your Google Sheets

  v-card-text
    template(v-if="showSpinner")
      v-progress-circular(indeterminate color="primary")
      p Talking to Google...

    template(v-else)
      v-btn(v-if="remoteSources.length == 0" @click="fetchRemoteSources")
        | Fetch Sheet Listing...

      div(v-else)
        v-btn(@click="fetchRemoteSources")
          | Refresh Sheet Listing...

        p
          strong Select a Sheet to Import or Refresh:

        ul.menu.vertical
          li(v-for="remoteSource in remoteSources")
            a(@click="importRemoteSource(remoteSource.id)" :title="remoteSource.id")
              | {{ remoteSourceImportLabel(remoteSource) }}
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    computed: mapGetters(["showSpinner", "sourceExists", "remoteSources"]),

    methods: {
      ...mapActions(["fetchRemoteSources"]),

      importRemoteSource(remoteSourceId) {
        this.$store.dispatch("importRemoteSource", remoteSourceId).then(() => {
          this.$modal.hide("Source Manager")
        })
      },

      remoteSourceImportLabel(remoteSource) {
        let label = remoteSource.name
        label += this.$store.getters.sourceExists(remoteSource.id) ? " (Refresh)" : " (Add)"
        return label
      }
    }
  }
</script>
