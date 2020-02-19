<template lang="pug">
  v-tooltip(v-if="folderId || force" top)
    | {{ folderId || "No Folder Id" }}

    a(v-if="driveLink" slot="activator" :href="driveLink" target="_blank")
      v-icon(:large="large" :color="color") mdi-folder-google-drive

    v-icon(v-else slot="activator" :large="large" :color="color") mdi-folder-google-drive
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ["folderId", "color", "large", "force"],

    computed: {
      ...mapGetters(["findFolder"]),

      driveLink() {
        if(this.folderId && this.findFolder(this.folderId, false)) {
          return `https://drive.google.com/drive/folders/${this.folderId}`
        }
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
