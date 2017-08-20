<template lang="pug">
.reveal#source-paste-form(data-reveal)
  h2 Import a Google Sheet

  p.error-with-paste(v-if="errorWithPaste") Error: {{ errorWithPaste }}

  label
    | Paste a Google Sheets link or ID here:
    input(type="text" name="source-paste" v-model="pastedSource" placeholder="https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

  ul.menu
    li
      a.button.alert(@click="closeModal()") Cancel
    li
      a.button.success(@click="importSourceViaPaste()") Import

  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import FoundationMixin from '../mixins/foundation'
  import RevealMixin from '../mixins/reveal'

  // Via: https://stackoverflow.com/questions/16840038/easiest-way-to-get-file-id-from-url-on-google-apps-script
  const GOOGLE_ID_REGEX = /[-\w]{25,}/
  let matchGoogleId = (url) => { url.match(GOOGLE_ID_REGEX) }

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
        // TODO: set a spinner
        // grab the pasted value
        console.log("Pasted:", this.pastedSource)
        // match and extract the sheet id portion
        let googleId = matchGoogleId(this.pastedSource)
        console.log("Matched:", googleId)
        // error out from id parse failure
        if(!googleId){
          // TODO: remove spinner
          // communicate an error
          this.errorWithPaste = `No Google Sheet ID detected in "${this.pastedSource}"`
          return
        }
        // fetch vitals from google
        googleSheets.fetchSheetById(googleId)
          .then(function(googleSheet) {
            // insert into vuex store
            // call setActiveSource mutation

            this.closeModal()
          })

          .catch(Error, function() {
            // error out from sheet fetch failure
            // TODO: remove spinner
            // TODO: communicate an error
          })
      },
    }
  }
</script>

<style>
  .error-with-paste {
    color: darkred;
  }
</style>
