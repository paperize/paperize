<template lang="pug">
v-tooltip(v-if="folderId || force" top)
  | Go to linked Google Drive Folder: {{ (folder && folder.name) || folderId || "No Folder ID" }}

  template(v-slot:activator="{ on }")
    a(v-if="driveLink" v-on="on" :href="driveLink" target="_blank")
      v-icon(:large="large" :color="color") mdi-folder-google-drive

    v-icon(v-else v-on="on" :large="large" :color="color") mdi-folder-google-drive
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ["folderId", "color", "large", "force"],

    computed: {
      ...mapGetters(["findFolder"]),

      folder() {
        return this.folderId && this.findFolder(this.folderId, false)
      },

      driveLink() {
        if(this.folder) {
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
