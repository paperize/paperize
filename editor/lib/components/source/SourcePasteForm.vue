<template lang="pug">
v-form.source-paste(@submit.prevent="importSourceViaPaste()")
  v-card
    v-card-title
        .headline Import a Google Sheet

    v-card-text(v-if="showSpinner")
      v-progress-circular(indeterminate color="primary")
      p Talking to Google...

    v-card-text(v-else)
      p.error-with-paste(v-if="errorWithPaste") Error: {{ errorWithPaste }}
      v-text-field(label="Paste the URL of your Google Sheet" v-model="pastedSource" placeholder="https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

    v-card-actions
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
