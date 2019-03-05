<template lang="pug">
  v-tooltip(v-if="sheetId" top)
    | {{ sheetId }}

    a(slot="activator" :href="driveLink" target="_blank")
      v-icon mdi-google-spreadsheet
</template>

<script>
  export default {
    props: ["sheetId"],

    computed: {
      driveLink() {
        return `https://docs.google.com/spreadsheets/d/${this.sheetId}/edit`
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
