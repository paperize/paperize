<template lang="pug">
modal(name="source-explorer" height="auto" :pivotY="0.25" :scrollable="true")
  .grid-x.grid-padding-x
    .small-12.cell
      h2 Browse Your Google Sheets

    .small-12.cell(v-if="showSpinner")
      spinner(message="Talking to Google...")

    .small-12.cell(v-else)
      a.button(v-if="remoteSources.length == 0" @click="fetchRemoteSources")
        | Fetch Sheet Listing...
      div(v-else)
        a.button(@click="fetchRemoteSources")
          | Refresh Sheet Listing...

        p
          strong Select a Sheet to Import or Refresh:

        ul.menu.vertical
          li(v-for="remoteSource in remoteSources")
            a(@click="importRemoteSource(remoteSource.id)" :title="remoteSource.id")
              | {{ remoteSourceImportLabel(remoteSource) }}

    button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('source-explorer')")
      span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import spinner from 'vue-simple-spinner'

  export default {
    components: { spinner },

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
