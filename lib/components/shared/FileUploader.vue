<template lang="pug">
div
  v-icon(@click="showUploader = true") mdi-folder-plus

  v-dialog(v-model="showUploader" @close-dialog="showDebugMenu = false" max-width="500" lazy)
    v-card
      v-toolbar
        v-toolbar-title.text-xs-center File Uploader

      v-card-text
        p Uploading to Folder: {{ folder.name }}
        p Explanation of Drive permissions that require use of this uploader.

        v-list
          v-list-tile(v-for="file in files" :key="file.name")
            v-list-tile-avatar
              v-icon mdi-file-image

            v-list-tile-content
              v-list-tile-title {{ file.name }}
              v-list-tile-sub-title
                v-progress-linear(v-model="fileProgress")

            v-list-tile-action
              v-btn(@click="removeFile(file)" icon ripple)
                v-icon(color="grey lighten-1") cancel

      v-card-actions
        v-btn(v-if="anyFiles" color="success" @click="performUpload") Start Uploading

        vue-upload-component(v-model="files" :multiple="true" accept="image/*")
          v-btn Choose {{ anyFiles ? "More" : "" }} Files
</template>

<script>
  import { readAsDataURL } from 'promisify-file-reader'
  import VueUploadComponent from 'vue-upload-component'
  import { remove } from 'lodash'
  import { mapGetters } from 'vuex'
  import drive from '../../services/google/drive'

  export default {
    props: {
      folderId: {
        type: String,
        required: true,
      },
    },

    data: () => {
      return {
        files: [],
        showUploader: false,
        fileProgress: 45
      }
    },

    components: { VueUploadComponent },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "findFolder",
      ]),

      folder() {
        return this.findFolder(this.folderId)
      },

      anyFiles() {
        return this.files.length > 0
      }
    },

    methods: {
      removeFile(file) {
        this.files.splice(this.files.indexOf(file), 1)
      },

      performUpload() {
        return Promise.map(this.files, (fileToUpload) => {
          return readAsDataURL(fileToUpload.file)

          .then((result) => {
            const
              fileContents = result.replace(`data:${fileToUpload.type};base64,`, ""),
              fileName = fileToUpload.name,
              mimeType = fileToUpload.type,
              parentFolder = this.workingDirectoryId

            return drive.createFile(fileName, mimeType, parentFolder, fileContents, { base64: true })
          })
        }, { concurrency: 5 })

        .then(console.log)
      }
    }
  }


</script>
