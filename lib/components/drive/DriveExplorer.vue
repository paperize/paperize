<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title
      v-icon mdi-google-drive
      |  Drive Explorer

  v-card-text(style="min-height: 500px;")
    p What Google Drive items does Paperize know about? Use the refresh buttons to find new and changed files.

    h2.subtitle-1 Primary Index
    v-treeview(v-model="tree" :items="completeIndexAsTree" item-key="id")
      template(slot="prepend" slot-scope="{ item }")
        //- Folders
        template(v-if="item.type == 'folder'")
          folder-icon(:folderId="item.id" :color="refreshColor(item)")
          file-uploader(:folderId="item.id")
          a(@click="refreshFolder(item.id)")
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-icon(v-on="on") refresh
              span refreshed {{ lastRefresh(item.refreshedAt) }}

        //- Sheets
        template(v-else-if="item.type == 'sheet'")
          spreadsheet-icon(:spreadsheetId="item.id")
          a(@click="refreshSheetRecord(item.id)")
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-icon(v-on="on") refresh
              span refreshed {{ lastRefresh(item.refreshedAt) }}

        //- Images
        template(v-else-if="item.type == 'image'")
          image-icon(:imageId="item.id")
          a(@click="refreshImageRecord(item.id)")
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-icon(v-on="on") refresh
              span refreshed {{ lastRefresh(item.refreshedAt) }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import FolderIcon from "../icons/FolderIcon.vue"
import FileUploader from '../shared/FileUploader.vue'
import ImageIcon from "../icons/ImageIcon.vue"
import SpreadsheetIcon from "../icons/SpreadsheetIcon.vue"

export default {
  components: {
    FolderIcon,
    FileUploader,
    ImageIcon,
    SpreadsheetIcon
  },

  data() {
    return {
      tree: []
    }
  },

  computed: mapGetters([
    "workingDirectoryId",
    "completeIndexAsTree"
  ]),

  methods: {
    ...mapActions([
      "refreshRootFolderIndex",
      "refreshFolderIndex",
      "refreshImageRecord",
      "refreshSheetRecord",
    ]),

    refreshFolder(folderId) {
      return folderId == this.workingDirectoryId ?
        this.refreshRootFolderIndex() :
        this.refreshFolderIndex({ folderId })
    },

    lastRefresh(refreshedAt) {
      return refreshedAt ?
        moment(refreshedAt).fromNow() :
        'never'
    },

    neverRefreshed(item) {
      return !item.refreshedAt
    },

    refreshColor(item) {
      if(!item.refreshedAt) {
        return 'rgb(200, 200, 200)'
      }
    }
  }
}
</script>

<style scoped>
  .subtitle-1 {
    text-decoration: underline;
  }
</style>
