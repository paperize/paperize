<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title.text-xs-center Developer

  v-card-title Uploader-majig
  v-list
    v-list-tile
      v-list-tile-content
        file-uploader(:folderId="workingDirectoryId")
</template>

<script>
  import FileUploader from '../shared/FileUploader.vue'
  import { mapActions, mapGetters } from 'vuex'
  import drive from '../../services/google/drive'

  export default {

    components: { FileUploader },

    computed: {
      ...mapGetters(["workingDirectoryId"]),
    },

    methods: {
      ...mapActions([ ]),
    }
  }
</script>
