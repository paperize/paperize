<template lang="pug">
.reveal#source-explorer(data-reveal)
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
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import FoundationMixin from '../../mixins/foundation'
  import RevealMixin from '../../mixins/reveal'

  export default {
    mixins: [ RevealMixin, FoundationMixin ],

    computed: mapGetters(["sourceExists", "remoteSources"]),

    methods: {
      ...mapActions(["fetchRemoteSources", "importSource"]),

      sourceImportLabel(source) {
        let label = source.name
        label += this.$store.getters.sourceExists(source) ? " (Refresh)" : " (Add)"
        return label
      }
    }
  }
</script>
