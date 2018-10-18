<template lang="pug">
v-form.game-form(ref="gameForm" @submit.prevent="submitGame")
  v-card
    v-card-title
      .headline {{ headlineText }}

    v-card-text
      v-text-field.game-title(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")

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
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      headlineText() { return this.game.id ? `Editing ${this.game.title}` : "Design a New Game" },
      submitButtonText() { return this.game.id ? `Update` : "Start Designing" },
    },

    methods: {
      ...mapActions(["createGame", "updateGame"]),

      submitGame() {
        if(this.$refs.gameForm.validate()) {
          if(this.game.id) {
            this.updateGame({ ...this.game, title: this.gameTitle })
          } else {
            this.createGame({ title: this.gameTitle })
          }

          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
