<template lang="pug">
v-form(ref="gameForm" v-on:submit.prevent="submitGame")
  v-card
    v-card-title
      .headline Design a New Game

    v-card-text
      v-text-field(v-model="gameTitle" :rules="[rules.required]" label="Title" placeholder="Settlers of Carcassonne")

    v-card-actions
      v-btn(small color="success" @click="submitGame") Start Designing
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

    methods: {
      ...mapActions(["createGame", "updateGame"]),

      submitGame() {
        if(this.$refs.gameForm.validate()) {
          if(this.game.id) {
            this.updateGame({ ...this.game, title: this.gameTitle })
          } else {
            this.createGame({ title: this.gameTitle })
          }
        }
      }
    }
  }
</script>
