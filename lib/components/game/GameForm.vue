<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline {{ headlineText }}

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")
      template(v-if="!isSaved")
        v-checkbox.game-create-game-folder(v-model="gameFolder" label="Create a Google Drive Folder for this game?")
        v-checkbox.game-create-spreadsheet(v-model="componentSpreadsheet" label="Create a Google Spreadsheet inside for its components?")
        v-checkbox.game-create-image-folder(v-model="imageFolder" label="Create an Images Folder inside for its images?")

    v-card-actions
      v-btn(small color="success" @click="submitGame") {{ submitButtonText }}
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      game: {
        default() { return {} }
      }
    },

    data() {
      return {
        gameTitle: this.game.title,
        gameFolder: true,
        componentSpreadsheet: true,
        imageFolder: true,
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      isSaved() { return !!this.game.id },
      headlineText() { return this.isSaved ? `Editing ${this.game.title}` : "Design a New Game" },
      submitButtonText() { return this.isSaved ? `Update` : "Start Designing" },
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
              gameFolder: this.gameFolder,
              componentSpreadsheet: this.componentSpreadsheet,
              imageFolder: this.imageFolder
            })
          }

          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
