<template lang="pug">
v-tooltip(v-if="folderId" top)
  a(slot="activator" :href="driveLink" target="_blank")
    v-icon folder
  p {{ folderId }}
  span A game folder on Google Drive
</template>

<script>
  export default {
    props: ["folderId"],

    computed: {
      driveLink() {
        return `https://drive.google.com/drive/folders/${this.folderId}`
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
