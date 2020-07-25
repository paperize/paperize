<template lang="pug">
v-layout(row fluid).game-panel
  v-flex(xs12 md4)
    .headline {{ game.title || "[No title]" }}

    v-btn.edit-game-button(small fab @click="showEditDialog = true")
      v-icon edit

      v-dialog(v-model="showEditDialog" max-width="500" lazy)
        game-form(:game="game" @close-dialog="showEditDialog = false")

    folder-icon(:folderId="game.folderId")
    file-uploader(:folderId="game.folderId")
    spreadsheet-icon(:spreadsheetId="game.spreadsheetId")

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
  import { mapActions, mapGetters } from 'vuex'
  import pdfRenderer from '../../services/pdf_renderer'
  import GameForm from './GameForm.vue'
  import FolderIcon from '../icons/FolderIcon.vue'
  import FileUploader from '../shared/FileUploader.vue'
  import SpreadsheetIcon from '../icons/SpreadsheetIcon.vue'
  import PrintSettings from '../print/PrintSettings.vue'

  export default {
    props: {
      game: { required: true }
    },

    components: {
      GameForm,
      FolderIcon,
      FileUploader,
      SpreadsheetIcon,
      PrintSettings,
    },

    data() {
      return {
        showEditDialog: false,
        showDeleteDialog: false,
        showPrintSettingsDialog: false
      }
    },

    computed: mapGetters(["projectGame"]),

    methods: {
      ...mapActions(["destroyGame"]),

      deleteGame() {
        this.$router.push({ name: "gameManager" })
        return this.destroyGame(this.game)
      },

      printGame() {
        this.setPrintTarget("pdf")
        this.projectGame(this.game)
          .then((game) => {
            pdfRenderer.renderGameToPdf(game)
          })
      }
    }
  }
</script>
