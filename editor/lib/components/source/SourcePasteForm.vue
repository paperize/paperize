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
