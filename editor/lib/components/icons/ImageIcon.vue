<template lang="pug">
v-tooltip(v-if="folderId" top)
  a(slot="activator" :href="driveLink" target="_blank")
    v-icon mdi-image
  p {{ folderId }}
  span An image on Google Drive
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
