<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline Design a New Game

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")

      template(v-if="game")
        p(v-if="gameFolder") Creating Folder... Done!
        p(v-else) Creating Folder...
        p(v-if="gameImagesFolder") Creating Game Images Folder... Done!
        p(v-else) Creating Game Images Folder...
        p(v-if="gameSpreadsheet") Creating Game Sheet... Done!
        p(v-else) Creating Game Sheet...

    v-card-actions
      v-btn(small color="success" @click="submitGame") Start Designing
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  import FolderIcon from '../icons/FolderIcon.vue'
  import SpreadsheetIcon from '../icons/SpreadsheetIcon.vue'

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
          // Set "Success" message and pause a moment
          setTimeout(() => {
            // Close dialog
            this.$emit("close-dialog")
            // Route to the game we just created
            this.$router.push({ name: "gameEditor", params: { gameId: this.gameId }})
          }, 1000)
        }
      }
    }
  }
</script>
