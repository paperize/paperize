<template lang="pug">
v-tooltip(v-if="folderId" top)
  a(slot="activator" :href="driveLink" target="_blank")
    v-icon(:color="color") mdi-folder-google-drive
  p {{ folderId }}
  span A folder on Google Drive
</template>

<script>
  export default {
    props: ["folderId", "color"],

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
