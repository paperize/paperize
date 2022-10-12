<template lang="pug">
div(v-if="!game")
  p no game selected

v-container(v-else fluid grid-list-md)
  game-panel(:game="game")

  v-divider

  v-layout.component-section(row)
    v-flex(sm4 md3 lg2)
      component-panel(:components="findAllGameComponents(game)")

    v-flex.active-component(sm8 md9 lg10)
      component-editor(v-if="activeComponent" :component="activeComponent")
      .headline(v-else) No Component Selected
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import GamePanel from './GamePanel.vue'
import ComponentPanel from '../component/ComponentPanel.vue'
import ComponentEditor from '../component/ComponentEditor.vue'

export default {
  props: ['gameId'],

  mounted() { this.ensureFontsFetchedForGame(this.game) },

  components: { GamePanel, ComponentPanel, ComponentEditor },

  computed: {
    ...mapGetters([
      'findAllGameComponents',
      'activeComponent',
      "findGame"
    ]),

    game() {
      return this.findGame(this.gameId)
    }
  },

  methods: mapActions([ 'ensureFontsFetchedForGame' ])
}
</script>
