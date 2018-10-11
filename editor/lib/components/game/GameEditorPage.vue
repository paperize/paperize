<template lang="pug">
div(v-if="!game")
  p no game selected

v-container(v-else fluid)
  game-panel(:game="game")

  v-layout(row)
    v-flex(sm4 md3 lg2)
      component-panel(:components="findAllGameComponents(game)")

    v-flex(sm8 md9 lg10)
      .active-component
        component-editor(v-if="activeComponent" :component="activeComponent")
        .headline(v-else) No Component Selected
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  import GamePanel from './GamePanel.vue'
  import ComponentPanel from '../component/ComponentPanel.vue'
  import ComponentEditor from '../component/ComponentEditor.vue'

  export default {
    props: ['gameId'],

    computed: mapGetters({
      findAllGameComponents: 'findAllGameComponents',
      activeComponent: 'activeComponent',
      game: 'activeGame'
    }),

    components: {
      "game-panel":       GamePanel,
      "component-panel":  ComponentPanel,
      "component-editor": ComponentEditor
    }
  }
</script>

<style>

</style>
