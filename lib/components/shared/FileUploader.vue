<template lang="pug">
v-tooltip(top v-if="currentFolderId")
  | Upload to linked Google Drive Folder: {{ folder.name }}
  template(v-slot:activator="{ on }")
    v-icon(v-on="on" @click="showUploader = true") mdi-folder-plus

  v-dialog(v-model="showUploader" @close-dialog="showUploader = false" max-width="500")
    v-card
      v-toolbar
        v-toolbar-title.text-center File Uploader

      v-card-text
        v-alert(v-if="!anyFiles" type="warning" outlined)
          .subtitle-1(align="center")
            strong Remember!<br/> Upload All Paperize Files Through Paperize!
          |  Paperize can ONLY see files that you upload through Paperize.

        p
          v-btn(small fab @click="openFolderPicker")
            v-icon edit
          strong= "Folder: "
          template(v-for="folder in parentFolders")
            template(v-if="folder.id == currentFolderId") {{ folder.name }}
            template(v-else)
              strong
                a(@click="currentFolderId = folder.id") {{ folder.name }}
              = " > "


        v-list(v-if="anyFiles")
          v-list-item(v-for="file in files" :key="file.name")
            v-list-item-avatar
              v-icon mdi-file-image

            v-list-item-content
              v-list-item-title {{ file.name }}
              v-list-item-subtitle(v-if="uploading")
                v-progress-linear(indeterminate)

            v-list-item-action
              v-btn(v-if="!uploading" @click="removeFile(file)" icon ripple)
                v-icon(color="grey lighten-1") cancel

      v-card-actions
        template(v-if="!uploading")
          vue-upload-component(v-model="files" :multiple="true" accept="image/*")
            v-btn Choose {{ anyFiles ? "More" : "" }} Files

          v-spacer

          v-btn(v-if="anyFiles" color="success" @click="performUpload") Start Uploading

        p(v-if="!anyFiles && uploading")
          v-progress-circular(indeterminate)
          |  Finishing up...
</template>

<script>
  import { readAsDataURL } from 'promisify-file-reader'
  import VueUploadComponent from 'vue-upload-component'
  import { reduce, remove } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import { openFolderPicker } from '../../services/google/picker'
  import drive from '../../services/google/drive'

  const FILE_UPLOAD_CONCURRENCY = 5

  export default {
    props: {
      folderId: {
        type: String,
        required: true
      },
    },

    data() {
      return {
        currentFolderId: this.folderId,
        files: [],
        showUploader: false,
        uploading: false
      }
    },

    components: { VueUploadComponent },

    watch: {
      showUploader(show) {
        // Reset the folder when the modal is hidden
        if(!show) { this.currentFolderId = this.folderId }
      }
    },

    computed: {
      ...mapGetters([
        "findFolder",
      ]),

      folder() {
        return this.findFolder(this.currentFolderId)
      },

      parentFolders() {
        return this.$store.getters.parentFolders(this.folder)
      },

      anyFiles() {
        return this.files.length > 0
      }
    },

    methods: {
      ...mapActions(["refreshRootFolderIndex"]),

      removeFile(file) {
        this.files.splice(this.files.indexOf(file), 1)
      },

      openFolderPicker() {
        openFolderPicker(this.currentFolderId).then((newFolderId) => {
          if(newFolderId) { this.currentFolderId = newFolderId }
        })
      },

      performUpload() {
        this.uploading = true
        return Bluebird.map(this.files, (fileToUpload) => {
          return readAsDataURL(fileToUpload.file)

          .then((result) => {
            const
              fileContents = result.replace(`data:${fileToUpload.type};base64,`, ""),
              fileName = fileToUpload.name,
              mimeType = fileToUpload.type,
              parentFolder = this.currentFolderId

            return drive.createFile(fileName, mimeType, parentFolder, fileContents, { base64: true })
          })

          .then(() => {
            this.removeFile(fileToUpload)
          })
        }, { concurrency: FILE_UPLOAD_CONCURRENCY })

        .then(() => {
          this.files.splice(0)

          return this.refreshRootFolderIndex()
        })

        .finally(() => {
          this.uploading = false
          this.showUploader = false
        })
      }
    }
  }


</script>

<style>
  .file-uploads label {
    cursor: pointer;
  }
</style>
