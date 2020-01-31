<template lang="pug">
div
  v-icon(@click="showUploader = true") mdi-folder-plus

  v-dialog(v-model="showUploader" @close-dialog="showDebugMenu = false" max-width="500" lazy)
    v-card
      v-toolbar
        v-toolbar-title.text-xs-center File Uploader

        //- v-list-tile
        //-   v-list-tile-content Uploading to Folder: {{ folderId }}

        v-list-tile(v-if="anyFiles")
          v-list-tile-content
            v-btn(color="success" @click="performUpload") Perform Upload

        v-list-tile
          v-list
            v-list-tile(v-for="file in files") {{ file.name }}
</template>

<script>
  import VueUploadComponent from 'vue-upload-component'

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
      }
    },

    components: { VueUploadComponent },

    computed: {
      anyFiles() {
        return this.files.length > 0
      }
    },

    methods: {

      performUpload() {
        const lastFile = this.files[this.files.length-1]

        let reader = new FileReader()
        reader.readAsDataURL(lastFile.file)
        reader.onloadend = () => {
          let fileContents = reader.result
          fileContents = fileContents.replace(`data:${lastFile.type};base64,`, "")

          drive.createFile(lastFile.name, lastFile.type, this.workingDirectoryId, fileContents, { base64: true })
          .then(console.log)
        }
      }
    }
  }


</script>
