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
        p
          strong Select a Sheet to Import or Refresh:

        ul.menu.vertical
          li(v-for="source in remoteSources")
            a(@click="importSource(source)" :title="source.id")
              | {{ sourceImportLabel(source) }}

    button.close-button(aria-label="Close modal" type="button" @click="closeModal")
      span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import spinner from 'vue-simple-spinner'

  export default {
    components: { spinner },

    computed: mapGetters(["showSpinner", "sourceExists", "remoteSources"]),

    methods: {
      ...mapActions(["fetchRemoteSources", "importSource"]),

      sourceImportLabel(source) {
        let label = source.name
        label += this.$store.getters.sourceExists(source) ? " (Refresh)" : " (Add)"
        return label
      },

      closeModal() {
        this.$modal.hide("source-explorer")
      }

    }
  }
</script>
