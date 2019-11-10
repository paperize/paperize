<template lang="pug">
v-flex.game(sm6 md4 lg3 :id="`game-${ game.id }`")
  v-card
    v-card-title
      .headline
        folder-icon(:folderId="game.folderId")
        |  {{ game.title || "[No title]" }}

    v-responsive
      img(:src="game.coverArt")

    v-card-actions
      v-btn(@click="$router.push({ name: 'gameEditor', params: { gameId: game.id }})") Edit
      v-btn(@click="showDeleteDialog = true") Delete
        v-dialog(v-model="showDeleteDialog" max-width="500" lazy)
          v-card
            v-card-title
              .headline Are you sure you want to delete the Game "{{ game.title }}"?
            v-card-text It has X Components and was last printed Y.
            v-card-actions
              v-btn(@click="showDeleteDialog = false") No
              v-btn(@click="destroyGame(game)") Yes
</template>

<script>
  import { mapActions } from 'vuex'
  import FolderIcon from '../icons/FolderIcon.vue'

  export default {
    props: {
      game: {
        required: true
      }
    },

    components: { FolderIcon },

    data() {
      return {
        showDeleteDialog: false
      }
    },

    methods: mapActions(["destroyGame"]),
  }
</script>

<style scoped>
  dd {
    font-size: .8em;
  }
</style>
