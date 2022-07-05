<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline Design a New Game

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" :disabled="!!game" label="Title" placeholder="Settlers of Carcassonne")

      template(v-if="game")
        v-layout
          v-flex(xs2)
            v-icon(v-if="gameFolder" color="green") check_circle
            v-progress-circular(v-else indeterminate color="primary")
          v-flex(xs10) Creating Folder

        v-layout
          v-flex(xs2)
            v-icon(v-if="gameImagesFolder" color="green") check_circle
            v-progress-circular(v-else indeterminate color="primary")
          v-flex(xs10) Creating Images Subfolder

        v-layout
          v-flex(xs2)
            v-icon(v-if="gameSpreadsheet" color="green") check_circle
            v-progress-circular(v-else indeterminate color="primary")
          v-flex(xs10) Creating Spreadsheet

    v-card-actions(v-if="!game")
      v-btn(small color="success" @click="submitGame") Start Designing
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  import FolderIcon from '../icons/FolderIcon.vue'
  import SpreadsheetIcon from '../icons/SpreadsheetIcon.vue'

  const DELAY_MS_AFTER_DRIVE_COMPLETE = 800

  export default {
    components: {
      FolderIcon,
      SpreadsheetIcon
    },

    data() {
      return {
        gameId: null,
        gameTitle: "",
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    watch: {
      "game.spreadsheetId": "verifyDriveComplete"
    },

    computed: {
      ...mapGetters({
        workingDirectoryId: "workingDirectoryId",
        findGame: "findGame",
        getGameFolder: "gameFolder",
        getGameImagesFolder: "gameImagesFolder",
        getGameSpreadsheet: "gameSpreadsheet",
      }),

      game() {
        return this.gameId && this.findGame(this.gameId)
      },

      gameFolder() {
        return this.getGameFolder(this.game)
      },

      gameImagesFolder() {
        return this.getGameImagesFolder(this.game)
      },

      gameSpreadsheet() {
        return this.getGameSpreadsheet(this.game)
      },
    },

    methods: {
      ...mapActions([
        "createGame",
        "createDriveArtifactsForGame",
      ]),

      submitGame() {
        if(this.$refs.gameForm.validate()) {
          this.createGame({ title: this.gameTitle })
            .then((gameId) => {
              this.gameId = gameId
              return this.createDriveArtifactsForGame(this.game)
            })
        }
      },

      verifyDriveComplete() {
        // We don't move on until the spreadsheet is in place
        if(this.game && this.gameSpreadsheet) {
          // Pause a moment so user can see that we were successful
          setTimeout(() => {
            // Close dialog
            this.$emit("close-dialog")
            // Route to the game we just created
            this.$router.push({ name: "gameEditor", params: { gameId: this.gameId }})
          }, DELAY_MS_AFTER_DRIVE_COMPLETE)
        }
      }
    }
  }
</script>
