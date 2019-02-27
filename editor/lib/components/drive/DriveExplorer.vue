<template lang="pug">
v-card
  v-card-title
    h2.subheading Drive Explorer
  v-card-text
    v-treeview(v-model="tree" :items="items" item-key="name" open-on-click)
      template(slot="prepend" slot-scope="{ item }")
        folder-icon(v-if="item.type == 'folder'" :folderId="item.id")
        sheet-icon(v-else-if="item.type == 'spreadsheet'" :sheetId="item.id")
        image-icon(v-else-if="item.type == 'image'" :imageId="item.id")
</template>

<script>
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
        tree: [],
        items: [
          {
            id: 'abc',
            name: 'Paperize.io',
            type: 'folder',
            children: [
              {
                id: 'def',
                name: "Love Letter",
                type: 'folder',
                children: [
                  {
                    id: 'ghi',
                    name: "Cards",
                    type: 'spreadsheet'
                  }, {
                    id: 'mno',
                    name: "Monument",
                    type: 'image'
                  }
                ]
              }, {
                id: 'jkl',
                name: "Images",
                type: 'folder',
                children: []
              }

            ]
          },
        ]
      }
    }
  }
</script>
