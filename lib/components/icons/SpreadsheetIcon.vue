<template lang="pug">
  v-tooltip(v-if="(spreadsheetId || force)" top)
    | {{ spreadsheetId || "No Spreadsheet Id" }}

    a(v-if="driveLink" slot="activator" :href="driveLink" target="_blank")
      v-icon(:large="large") mdi-google-spreadsheet

    v-icon(v-else slot="activator" :large="large") mdi-google-spreadsheet
</template>

<script>

  export default {
    props: ["spreadsheetId", "large", "force"],

    computed: {
      ...mapGetters(["findSpreadsheet"]),

      driveLink() {
        if(this.spreadsheetId && this.findSpreadsheet(this.spreadsheetId, false)) {
          return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/edit`
        }
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
