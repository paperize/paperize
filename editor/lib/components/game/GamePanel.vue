<template lang="pug">
v-layout(row fluid).game-panel
  v-flex(xs12 md4)
    .headline {{ game.title || "[No title]" }}

    folder-icon(:folderId="game.folderId")
    //- image-folder-icon(:folderId="game.folderId")
    sheet-icon(:sheetId="game.sourceId")

  v-flex(xs12 md8)
    v-layout(row fluid)
      v-flex(sm12)
        v-btn(small @click="printGame()")
          v-icon(left) photo_library
          | Print Game

        v-btn(small title="Print Settings" @click="showPrintSettingsDialog = true")
          v-icon(left) settings
          | Print Settings

          v-dialog(v-model="showPrintSettingsDialog" max-width="500" lazy)
            print-settings

        v-btn(small @click="showEditDialog = true")
          v-icon(left) edit
          | Edit Game

          v-dialog(v-model="showEditDialog" max-width="500" lazy)
            game-form(:game="game" @close-dialog="showEditDialog = false")

        v-btn(small @click="showDeleteDialog = true")
          v-icon(left) delete
          | Delete Game

          v-dialog(v-model="showDeleteDialog" max-width="500" lazy)
            v-card.delete-game
              v-card-title
                .headline Are you sure you want to delete the Game "{{ game.title }}"?
              v-card-text It has X Components and was last printed Y.
              v-card-actions
                v-btn(@click="showDeleteDialog = false") No
                v-btn(@click="deleteGame") Yes
</template>

<script>
  import { mapActions } from 'vuex'
  import pdfRenderer from '../../services/pdf_renderer'
  import GameForm from './GameForm.vue'
  import FolderIcon from '../icons/FolderIcon.vue'
  import ImageFolderIcon from '../icons/ImageFolderIcon.vue'
  import SheetIcon from '../icons/SheetIcon.vue'
  import PrintSettings from '../print/PrintSettings.vue'

  export default {
    props: ["game"],

    components: {
      GameForm,
      FolderIcon,
      ImageFolderIcon,
      SheetIcon,
      PrintSettings,
    },

    data() {
      return {
        showEditDialog: false,
        showDeleteDialog: false,
        showPrintSettingsDialog: false
      }
    },

    methods: {
      ...mapActions(["destroyGame"]),

      deleteGame() {
        this.$router.push({ name: "gameManager" })
        return this.destroyGame(this.game)
      },

      printGame() {
        pdfRenderer.renderGameToPdf(this.game)
      }
    }
  }
</script>
