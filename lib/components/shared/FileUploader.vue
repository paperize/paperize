<template lang="pug">
div
  v-icon(@click="showUploader = true") mdi-folder-plus

  v-dialog(v-model="showUploader" @close-dialog="showDebugMenu = false" max-width="500" lazy)
    v-card
      v-toolbar
        v-toolbar-title.text-xs-center File Uploader

      v-list
        v-list-tile
          v-list-tile-content Uploading to Folder: {{ folderId }}

        v-list-tile
          v-list-tile-content
            vue-upload-component(v-model="files" :multiple="true" accept="image/*")
              v-btn Choose Files

        //- v-list-tile
        //-   v-list-tile-content
        //-     v-card
        v-list
          v-list-tile(v-for="file in files" :key="file.name")
            v-list-tile-avatar
              v-icon mdi-file-image

            v-list-tile-content
              v-list-tile-title {{ file.name }}
              v-list-tile-sub-title
                v-progress-linear(v-model="fileProgress")

            v-list-tile-action
              v-btn(icon ripple)
                v-icon(color="grey lighten-1") info


        v-list-tile(v-if="anyFiles")
          v-list-tile-content
            v-btn(color="success" @click="performUpload") Perform Upload
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
        files: [{ name: "Big Sunset.png" }, { name: "Quiet Night.jpg" }, { name: 'Lookout!.png' }],
        showUploader: false,
        fileProgress: 45
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
