<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title.text-xs-center Debugger

  v-card-title File Upload Test {{ anyFiles }}
  v-list
    v-list-tile
      v-list-tile-content
        file-upload(v-model="files" accept="image/*" :multiple="true")
          v-btn(v-if="anyFiles" color="info" ) Add More Files
          v-btn(v-else color="success") Choose Files to Upload

    v-list-tile(v-if="anyFiles")
      v-list-tile-content
        v-btn(color="success" @click="performUpload") Perform Upload

    v-list-tile
      v-list
        v-list-tile(v-for="file in files") {{ file.name }}
</template>

<script>
  import VueUploadComponent from 'vue-upload-component'
  import { mapActions, mapGetters } from 'vuex'
  import drive from '../../services/google/drive'

  export default {
    components: {
      "file-upload": VueUploadComponent
    },

    data: () => {
      return {
        files: []
      }
    },

    computed: {
      ...mapGetters(["workingDirectoryId"]),

      anyFiles() { return this.files.length > 0 }
    },

    methods: {
      ...mapActions([ ]),

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
