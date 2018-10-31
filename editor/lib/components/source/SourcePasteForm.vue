<template lang="pug">
v-form(@submit.prevent="importSourceViaPaste()")
  v-card
    v-card-title
        .headline Import a Google Sheet

    v-card-text
      template(v-if="showSpinner")
        v-progress-circular(indeterminate color="primary")
        p Talking to Google...

      template(v-else)
        p.error-with-paste(v-if="errorWithPaste") Error: {{ errorWithPaste }}

        label
          | Paste a Google Sheets link or ID here:
          input(type="text" name="source-paste" v-model="pastedSource" placeholder="https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

        v-btn(@click="$emit('close-dialog')") Cancel
        v-btn(@click="importSourceViaPaste()") Import
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
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
    }
  }
</script>

<style>
  .error-with-paste {
    color: darkred;
  }
</style>
