<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title
      v-icon mdi-google-drive
      |  Drive Explorer

  v-card-text(style="min-height: 500px;")
    h2.subheading Primary Index
    v-treeview(v-model="tree" :items="completeIndexAsTree" item-key="id")
      template(slot="prepend" slot-scope="{ item }")
        //- Folders
        template(v-if="item.type == 'folder'")
          folder-icon(:folderId="item.id" :color="refreshColor(item)")
          a(@click="refreshFolder(item.id)")
            v-tooltip(top)
              v-icon(slot="activator") refresh
              span refreshed {{ lastRefresh(item.refreshedAt) }}

        //- Sheets
        template(v-else-if="item.type == 'sheet'")
          sheet-icon(:spreadsheetId="item.id")
          a(@click="refreshSheetRecord(item.id)")
            v-tooltip(top)
              v-icon(slot="activator") refresh
              span refreshed {{ lastRefresh(item.refreshedAt) }}

        //- Images
        template(v-else-if="item.type == 'image'")
          image-icon(:imageId="item.id")
          a(@click="refreshImageRecord(item.id)")
            v-tooltip(top)
              v-icon(slot="activator") refresh
              span refreshed {{ lastRefresh(item.refreshedAt) }}

    h2.subheading Orphaned Items
    v-treeview(v-model="tree" :items="orphanedItemsAsTree" item-key="id")
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import moment from 'moment'
  import FolderIcon from "../icons/FolderIcon.vue"
  import ImageIcon from "../icons/ImageIcon.vue"
  import SheetIcon from "../icons/SheetIcon.vue"

  export default {
    components: {
      FolderIcon,
      ImageIcon,
      SheetIcon
    },

    data() {
      return {
        tree: []
      }
    },

    computed: mapGetters([
      "workingDirectoryId",
      "completeIndexAsTree",
      "orphanedItemsAsTree"
    ]),

    methods: {
      ...mapActions([
        "refreshRootFolderIndex",
        "refreshFolderIndex",
        "refreshImageRecord",
        "refreshSheetRecord",
      ]),

      refreshFolder(folderId) {
        if(folderId == this.workingDirectoryId) {
          if(confirm("Refresh the working directory?")) {
            return this.refreshRootFolderIndex()
          }
        } else {
          return this.refreshFolderIndex({ folderId })
        }
      },

      lastRefresh(refreshedAt) {
        return refreshedAt ? moment(refreshedAt).fromNow() : 'never'
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
  .subheading {
    text-decoration: underline;
  }
</style>
