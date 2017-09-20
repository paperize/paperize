<template lang="pug">
modal(name="source-paste-form" height="auto" :pivotY="0.25" :scrollable="true")
  h2 Import a Google Sheet

  spinner(v-if="showSpinner" message="Talking to Google...")

  div(v-else)
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
  import googleSheets from '../../google_sheets'
  import spinner from 'vue-simple-spinner'

  export default {
    components: { spinner },

    data() {
      return {
        pastedSource: '',
        errorWithPaste: null,
        showSpinner: false
      }
    },

    methods: {
      importSourceViaPaste() {
        // not loving this fragrance...
        let self = this

        self.showSpinner = true

        this.$store.dispatch("createOrUpdateSourceById", this.pastedSource)
          .catch(googleSheets.BadIdError, function(badIdError) {
            // TODO: remove spinner
            self.showSpinner = false
            console.log("rejected with bad id")
            self.errorWithPaste = `No Google Sheet ID detected in "${self.pastedSource}"`
          })

          .catch(googleSheets.NotFoundError, (nfError) => {
            // TODO: remove spinner
            self.showSpinner = false
            console.log("rejected with not found", nfError)
            self.errorWithPaste = `No Google Sheet found for ID: "${nfError.googleId}"`
          })

          .catch(function(error) {
            // TODO: remove spinner
            self.showSpinner = false
            console.log("rejected otherwise", error)
            throw error
          })
      },

      closeModal() {
        this.$modal.hide("source-paste-form")
      }
    }
  }
</script>

<style>
  .error-with-paste {
    color: darkred;
  }
</style>
