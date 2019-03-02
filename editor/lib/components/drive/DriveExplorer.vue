<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title
      v-icon mdi-google-drive
      |  Drive Explorer

  v-card-text
    v-treeview(v-model="tree" :items="completeIndexAsTree" item-key="id" open-on-click)
      template(slot="prepend" slot-scope="{ item }")
        //- Folders
        template(v-if="item.type == 'folder'")
          folder-icon(:folderId="item.id")
          v-tooltip(top)
            v-icon(slot="activator") refresh
            span refreshed {{ lastRefresh(item.refreshedAt) }}

        //- Sheets
        template(v-else-if="item.type == 'sheet'")
          sheet-icon(:sheetId="item.id")
          v-tooltip(top)
            v-icon(slot="activator") refresh
            span refreshed {{ lastRefresh(item.refreshedAt) }}

        //- Images
        image-icon(v-else-if="item.type == 'image'" :imageId="item.id")
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

    computed: mapGetters(["completeIndexAsTree"]),

    methods: {
      ...mapActions(["refreshDriveIndex"]),

      lastRefresh(refreshedAt) {
        return moment(refreshedAt).fromNow()
      }
    }
  }
</script>
