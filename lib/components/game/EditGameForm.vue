<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline Editing Game: "{{ game.title }}"

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")

      v-container(grid-list-md text-xs-center)
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

                v-autocomplete(box label="Select Spreadsheet" v-model="spreadsheetId" :items="allSpreadsheets" item-value="id" item-text="name")
                v-btn(@click="createSheetArtifactForGame(game)") Create New Spreadsheet

    v-card-actions
      v-btn(small color="success" @click="submitGame") Update
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { openFolderPicker } from '../../services/google/picker'

  import FolderIcon from '../icons/FolderIcon.vue'
  import SpreadsheetIcon from '../icons/SpreadsheetIcon.vue'

  export default {
    props: {
      game: {
        required: true
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
        }
      }
    },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "allSpreadsheets",
      ]),

      gameFolder() {
        return this.$store.getters.gameFolder(this.game)
      },

      gameSpreadsheet() {
        return this.$store.getters.gameSpreadsheet(this.game)
      },

      spreadsheetId: {
        get() { return this.gameSpreadsheet },
        set(spreadsheetId) {
          return this.updateGame({ ...this.game, spreadsheetId })
        }
      },
    },

    methods: {
      ...mapActions([
        "updateGame",
        "createSheetArtifactForGame"
       ]),

      submitGame() {
        if(this.$refs.gameForm.validate()) {
          this.updateGame({ ...this.game, title: this.gameTitle })
            .then(() => {
              this.$emit("close-dialog")
            })
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
    }
  }
</script>
