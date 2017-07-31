<template lang="pug">
div(v-if="!authenticated")
  p
    | You are not logged in.
    a(v-on:click="login") Click here to log in now.

div(v-else)
  h2 Game Manager

  a(data-open="new-game-modal") New Game

  .reveal#new-game-modal(data-reveal)
    h1 Create a New Game
    hr

    button.close-button(aria-label="Close modal" type="button" data-close)
      span(aria-hidden="true") &times;
</template>

<script>
  import FoundationMixin from '../mixins/foundation'
  import { mapState, mapActions } from 'vuex'

  export default {
    mixins: [FoundationMixin],

    computed: {
      ...mapState(["authenticated"])
    },

    methods: {
      ...mapActions(["login"])
    }
  }

</script>
