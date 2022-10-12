<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title.text-center Developer

  v-card-title Uploader-majig
  v-list
    v-list-item
      v-list-item-content
        file-uploader(:folderId="workingDirectoryId")
</template>

<script>
import FileUploader from '../shared/FileUploader.vue'
import { mapActions, mapGetters } from 'vuex'

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
