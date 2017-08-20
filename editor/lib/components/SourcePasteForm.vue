<template lang="pug">
.reveal#source-paste-form(data-reveal)
  h2 Import a Google Sheet

  label
    | Paste a Google Sheets link or ID here:
    input(type="text" name="source-paste" placeholder="https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

  ul.menu
    li
      a.button.alert(@click="closeModal()") Cancel
    li
      a.button.success(@click="importSourceViaPaste()") Import
</template>

<script>
  import RevealMixin from '../mixins/reveal'

  export default {
    mixins: [ RevealMixin ],

    methods: {
      importSourceViaPaste() {
        this.closeModal()
      },
    }
  }
</script>
