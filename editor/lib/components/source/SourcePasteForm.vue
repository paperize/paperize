<template lang="pug">
v-dialog
  form(@submit.prevent="importSourceViaPaste()")
    .grid-x.grid-padding-x
      .small-12.cell
        h2 Import a Google Sheet

      .small-12.cell(v-if="showSpinner")
        spinner(message="Talking to Google...")

      .small-12.cell(v-else)
        p.error-with-paste(v-if="errorWithPaste") Error: {{ errorWithPaste }}

        label
          | Paste a Google Sheets link or ID here:
          input(type="text" name="source-paste" v-model="pastedSource" placeholder="https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

        a.button.alert(@click="closeModal()") Cancel
        input.button.success(type="submit" value="Import")

  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters } from 'vuex'
  import spinner from 'vue-simple-spinner'

  export default {
    components: { spinner },

    data() {
      return {
        pastedSource: '',
        errorWithPaste: null
      }
    },

    computed: mapGetters(["showSpinner"]),

    methods: {
      importSourceViaPaste() {
        this.$store.dispatch("createOrUpdateSourceById", this.pastedSource)
          .catch((error) => {
            this.errorWithPaste = error.message
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
