<template lang="pug">
.reveal#source-paste-form(data-reveal)
  h2 Import a Google Sheet

  p.error-with-paste(v-if="errorWithPaste") Error: {{ errorWithPaste }}

  form(@submit.prevent="importSourceViaPaste()")
    label
      | Paste a Google Sheets link or ID here:
      input(type="text" name="source-paste" v-model="pastedSource" placeholder="https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

    ul.menu
      li
        a.button.alert(@click="closeModal()") Cancel
      li
        input.button.success(type="submit" value="Import")

  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import FoundationMixin from '../mixins/foundation'
  import RevealMixin from '../mixins/reveal'
  import googleSheets from '../google_sheets'

  export default {
    mixins: [ RevealMixin, FoundationMixin ],

    data() {
      return {
        pastedSource: '',
        errorWithPaste: null
      }
    },

    methods: {
      importSourceViaPaste() {
        let self = this
        // TODO: set a spinner
        // fetch vitals from google
        googleSheets.fetchSheetById(this.pastedSource)
          .then(function(googleSheet) {
            console.log(googleSheet)
            console.log(googleSheet.name)
            console.log(googleSheet.id)
            console.log(googleSheet.data)
            // TODO: insert into vuex store
            // TODO: call setActiveSource mutation

            self.closeModal()
          })

          .catch(googleSheets.BadIdError, function(badIdError) {
            console.log("rejected with bad id")
            self.errorWithPaste = `No Google Sheet ID detected in "${self.pastedSource}"`
          })

          .catch(googleSheets.NotFoundError, (nfError) => {
            console.log("rejected with not found", nfError)
            self.errorWithPaste = `No Google Sheet found for ID: "${nfError.googleId}"`
          })

          // .catch(Error, function(error) {
          //   console.log("rejected otherwise", error)
          //   // error out from sheet fetch failure
          //   // TODO: remove spinner
          //   // TODO: communicate an error
          // })
      },
    }
  }
</script>

<style>
  .error-with-paste {
    color: darkred;
  }
</style>
