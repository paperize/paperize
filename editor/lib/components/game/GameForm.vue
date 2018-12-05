<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline {{ headlineText }}

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")
      v-checkbox(v-if="!isSaved" v-model="createDriveFolder" label="Create a Google Drive Folder for this game?")

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
        createDriveFolder: true,
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
      ...mapActions(["createGame", "createGameAndDriveFolder", "updateGame"]),

      submitGame() {
        if(this.$refs.gameForm.validate()) {
          if(this.isSaved) {
            this.updateGame({ ...this.game, title: this.gameTitle })
          } else if(this.createDriveFolder){
            this.createGameAndDriveFolder({ title: this.gameTitle })
          } else {
            this.createGame({ title: this.gameTitle })
          }

          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
