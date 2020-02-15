<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline {{ headlineText }}

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")

      template(v-if="!isSaved")
        v-checkbox.game-create-game-folder(v-model="createGameFolder" label="Create a Google Drive Folder for this game?")
        v-checkbox.game-create-spreadsheet(v-model="createComponentSpreadsheet" label="Create a Google Spreadsheet inside for its components?")
        v-checkbox.game-create-image-folder(v-model="createImageFolder" label="Create an Images Folder inside for its images?")

      v-container(v-else grid-list-md text-xs-center)
        v-layout(row)
          v-flex(xs12 sm6)
            div
              v-label Game Folder:

            template(v-if="gameFolder")
              p
                folder-icon(:folderId="game.folderId")
                |  {{ gameFolder.name }}

              v-tooltip(top)
                | Clear this game's Folder
                v-btn(fab slot="activator" @click="clearFolder")
                  v-icon cancel

            template(v-else xs12 sm6)
              p
                folder-icon(:force="true")
                | No Game Folder set

              v-btn(@click="pickFolderFromDrive") Pick Folder

          v-flex(xs12 sm6)
            div
              v-label Game Spreadsheet:

            template(v-if="gameSpreadsheet")
              p
                spreadsheet-icon(:spreadsheetId="game.spreadsheetId")
                | {{ gameSpreadsheet.name }}

              v-tooltip(top)
                | Clear this game's Spreadsheet
                v-btn(fab slot="activator" @click="clearSpreadsheet")
                  v-icon cancel

            template(v-else)
              p
                spreadsheet-icon(:force="true")
                | No Game Spreadsheet set

                v-btn(@click="pickSheetFromDrive") Pick Spreadsheet

    v-card-actions
      v-btn(small color="success" @click="submitGame") {{ submitButtonText }}
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { openFolderPicker, openSheetPicker } from '../../services/google/picker'

  import FolderIcon from '../icons/FolderIcon.vue'
  import SpreadsheetIcon from '../icons/SpreadsheetIcon.vue'

  export default {
    props: {
      game: {
        default() { return {} }
      }
    },

    components: {
      FolderIcon,
      SpreadsheetIcon
    },

    data() {
      return {
        gameTitle: this.game.title,
        createGameFolder: true,
        createComponentSpreadsheet: true,
        createImageFolder: true,
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "findFolder",
        "findSpreadsheet"
      ]),

      isSaved() { return !!this.game.id },
      headlineText() { return this.isSaved ? `Editing Game: "${this.game.title}"` : "Design a New Game" },
      submitButtonText() { return this.isSaved ? `Update` : "Start Designing" },

      gameFolder() {
        if(this.game.folderId) {
          return this.findFolder(this.game.folderId)
        }
      },

      gameSpreadsheet() {
        if(this.game.spreadsheetId) {
          const maybeSpreadsheet = this.findSpreadsheet(this.game.spreadsheetId, false)
          return maybeSpreadsheet ? maybeSpreadsheet : { name: "Missing Spreadsheet" }
        }
      }
    },

    methods: {
      ...mapActions([
        "createGame",
        "createGameAndDriveArtifacts",
        "updateGame"
      ]),

      submitGame() {
        if(this.$refs.gameForm.validate()) {
          if(this.isSaved) {
            this.updateGame({ ...this.game, title: this.gameTitle })
          } else {
            this.createGameAndDriveArtifacts({
              game: { title: this.gameTitle },
              gameFolder: this.createGameFolder,
              createComponentSpreadsheet: this.createComponentSpreadsheet,
              createImageFolder: this.createImageFolder
            })
          }

          this.$emit("close-dialog")
        }
      },

      clearFolder() {
        this.updateGame({ ...this.game, folderId: null })
      },

      clearSpreadsheet() {
        this.updateGame({ ...this.game, spreadsheetId: null })
      },

      pickFolderFromDrive() {
        return openFolderPicker(this.workingDirectoryId)
          .then((folderId) => {
            if(!folderId) { return Promise.reject(new Error("No Folder picked.")) }

            return this.updateGame({ ...this.game, folderId })
          })
      },

      pickSheetFromDrive() {
        return openSheetPicker(this.workingDirectoryId)
          .then((spreadsheetId) => {
            if(!spreadsheetId) { return Promise.reject(new Error("No sheet picked.")) }

            return this.updateGame({ ...this.game, spreadsheetId })
          })
      },
    }
  }
</script>
