<template lang="pug">
v-card
  v-toolbar

    v-toolbar-title.text-xs-center Debugger

  v-card-title File Upload Test
  v-list
    v-list-tile

  v-card-title Picker Stuff
  v-list
    v-list-tile
      v-btn(@click="openPicker") Open Picker
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { openDebugPicker } from '../../services/google/picker.js'
  import drive from '../../services/google/drive.js'

  export default {
    data: () => {
      return {
        permissionId: null,
        recordId: null
      }
    },

    computed: mapGetters([]),

    methods: {
      ...mapActions([ ]),

      openPicker() {
        openDebugPicker((picker) => {
          picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          picker.addView(new google.picker.DocsUploadView())
          picker.addView(new google.picker.DocsView()
            .setIncludeFolders(true))
        })

        .then((pickedFiles) => {
          console.log(pickedFiles)
          return drive.getRecord(pickedFiles[0].id)
        })

        // .then(console.log)
      }
    }
  }
</script>
