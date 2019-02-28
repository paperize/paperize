<template lang="pug">
v-card
  v-toolbar
    v-toolbar-title Drive Explorer
    v-spacer
    v-btn(icon @click="refreshDriveIndex")
      v-icon refresh
  v-card-text
    v-treeview(v-model="tree" :items="completeIndexAsTree" item-key="id" open-on-click)
      template(slot="prepend" slot-scope="{ item }")
        folder-icon(v-if="item.type == 'folder'" :folderId="item.id")
        sheet-icon(v-else-if="item.type == 'sheet'" :sheetId="item.id")
        image-icon(v-else-if="item.type == 'image'" :imageId="item.id")
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
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

    methods: mapActions(["refreshDriveIndex"])
  }
</script>
