<template lang="pug">
modal(name="source-explorer" height="auto" :pivotY="0.25" :scrollable="true")
  h2 Browse Your Google Sheets

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

  export default {
    computed: mapGetters(["sourceExists", "remoteSources"]),

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
