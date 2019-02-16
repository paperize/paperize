<template lang="pug">
v-tooltip(v-if="sheetId" top)
  a(slot="activator" :href="driveLink" target="_blank")
    v-icon dashboard
  p {{ sheetId }}
  span A spreadsheet on Google Drive
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
</style>
