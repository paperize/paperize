<template lang="pug">
v-tooltip(v-if="(spreadsheetId || force)" top)
  | Google Sheet: {{ (sheet && sheet.name) || spreadsheetId || "No Spreadsheet ID" }}

  template(v-slot:activator="{ on }")
    a(v-if="driveLink" v-on="on" :href="driveLink" target="_blank")
      v-icon(:large="large") mdi-google-spreadsheet

    v-icon(v-else v-on="on" :large="large") mdi-google-spreadsheet
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ["spreadsheetId", "large", "force"],

    computed: {
      ...mapGetters(["findSpreadsheet"]),

      sheet() {
        return this.spreadsheetId && this.findSpreadsheet(this.spreadsheetId, false)
      },

      driveLink() {
        if(this.sheet) {
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
