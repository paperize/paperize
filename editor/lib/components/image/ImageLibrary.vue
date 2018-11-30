<template lang="pug">
v-card.image-library
  v-card-title
    .headline Image Library

  v-card-text
    .subheading Folders
    p Currently, all image files must be stored in Google Drive folders that you manage here.

    v-list
      v-list-tile(v-for="folder in imageFolders" :key="folder.id")
        v-list-tile-title {{ folder.name }} ({{ (folder.index || []).length }} images)
        v-list-tile-action
          v-btn(@click="refreshImageFileIndex(folder.id)")
            v-icon refresh

    .subheading Paste Link
    v-layout
      v-flex(xs12 sm8)
        v-text-field(v-model="pastedLink")
      v-flex(xs12 sm4)
        v-btn(@click="addImageFolderViaLink(pastedLink)") Import Folder
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {

    data() {
      return {
        pastedLink: ""
      }
    },

    computed: {
      ...mapGetters(["imageFolders"])
    },

    methods: {
      ...mapActions(["addImageFolderViaLink", "refreshImageFileIndex"])
    }
  }
</script>
