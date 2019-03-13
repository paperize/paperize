<template lang="pug">
  v-tooltip(v-if="spreadsheetId" top)
    | {{ spreadsheetId }}

    a(slot="activator" :href="driveLink" target="_blank")
      v-icon mdi-google-spreadsheet
</template>

<script>
  export default {
    props: ["spreadsheetId"],

    computed: {
      driveLink() {
        return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/edit`
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }

  a:hover i {
    color: rgb(17,146,78);
  }
</style>
