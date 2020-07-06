<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline {{ headlineText }}

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")

      template(v-if="!isSaved")
        p <b>Note:</b> Paperize will create a folder in your Drive to store all the game assets.
        template(v-if="creatingGameFolder")
          p <b>Creating game folder...</b>
        template(v-if="creatingImagesFolderAndDrive")
          p <b>Creating image folder and component spreadsheet...</b>
        template(v-if="createdGame")
          p <b>Done</b>

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
        rules: {
          required: value => !!value || 'Required.'
        },
        creatingGameFolder: false,
        creatingImagesFolderAndDrive: false,
        createdGame: false,
      }
    },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "findFolder",
        "findGame",
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
        "createDriveArtifacts",
        "updateGame"
      ]),

      submitGame() {
        if(this.$refs.gameForm.validate()) {
          if(this.isSaved) {
            this.updateGame({ ...this.game, title: this.gameTitle })
            this.$emit("close-dialog")
          } else {
            this.createGame(
              { title: this.gameTitle }
            ).then((gameId) => {
              let game = this.findGame(gameId)
              this.$store.subscribe((mutation,state) => {
                if (mutation.type === 'updateGame' && mutation.payload.id == gameId) {
                  this.updateGameCreateProgress(mutation.payload.creationStatus, gameId)
                }
              });
              this.createDriveArtifacts({
                game
              })
            })
          }
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

      updateGameCreateProgress(creationStatus, gameId) {
        switch(creationStatus) {
          case "initial_creation":
          case "creating_game_folder":
            this.creatingGameFolder = true
            break
          case "creating_image_folder_and_spreadsheet":
            this.creatingImagesFolderAndDrive = true
            break
          case "creation_completed":
            let router = this.$router
            this.createdGame = true
            setTimeout(function() {
              router.push({ name: "gameEditor", params: { gameId }})
              }, 2000);
            break
        }
      },
    },

  }

</script>
