<template lang="pug">
.reveal#source-explorer(data-reveal)
  h2 Browse Your Google Sheets

  a.button(v-if="fetchedSheets.length == 0" @click="fetchSheetListing") Fetch Sheet Listing...

  div(v-else)
    p
      strong Select a Sheet to Import or Refresh:

    ul.menu.vertical
      li(v-for="sheet in fetchedSheets")
        a(v-if="sourceExists(sheet)" @click="importSourceViaSelection(sheet)" :title="sheet.id")  {{ sheet.name }} (Refresh)
        a(v-else @click="importSourceViaSelection(sheet)" :title="sheet.id")  {{ sheet.name }} (Add)
</template>

<script>
  import { mapGetters } from 'vuex'
  import FoundationMixin from '../../mixins/foundation'
  import RevealMixin from '../../mixins/reveal'
  import googleSheets from '../../google_sheets'

  export default {
    mixins: [ RevealMixin, FoundationMixin ],

    data() {
      return {
        fetchedSheets: []
      }
    },

    computed: { ...mapGetters(["sourceExists"]) },

    methods: {
      fetchSheetListing() {
        let self = this
        // TODO: set a spinner
        // fetch listing from google
        googleSheets.fetchSheets()
          .then(function(sheets) {
            self.fetchedSheets = sheets
          })
      },

      importSourceViaSelection(sheet) {
        let self = this
        // TODO: set a spinner
        // fetch sheet from google
        googleSheets.fetchSheetById(sheet.id)
          .then((fetchedSheet) => {
            self.$store.dispatch("addAndSelectSource", { source: fetchedSheet })

            self.closeModal()
          })
      }
    }
  }
</script>
