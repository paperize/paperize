<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title.text-xs-center Debugger

  v-card-title File Upload Test
  v-list
    v-list-tile
      file-upload(v-model="files" accept="image/*" :multiple="true") Upload Files

    v-list-tile
      ul
        li(v-for="file in files") {{file.name}} - Error: {{file.error}}, Success: {{file.success}}
</template>

<script>
  import VueUploadComponent from 'vue-upload-component'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    components: {
      "file-upload": VueUploadComponent
    },

    data: () => {
      return {
        files: []
      }
    },

    computed: mapGetters([]),

    methods: {
      ...mapActions([ ]),
    }
  }
</script>
