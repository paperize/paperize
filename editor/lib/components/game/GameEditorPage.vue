<template lang="pug">
div(v-if="!game")
  p no game selected
.grid-container(v-else)
  game-panel(:game="game")

  hr

  .grid-x.grid-padding.x
    .small-2.cell
      component-panel(:components="game.components")

    .small-10.cell
      .active-component
        component-editor(v-if="activeComponent" :component="activeComponent")
        h2(v-else) No Component Selected
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  import GamePanel from './GamePanel.vue'
  import ComponentPanel from '../component/ComponentPanel.vue'
  import ComponentEditor from '../component/ComponentEditor.vue'

  export default {
    props: ['gameId'],

    computed: {
      ...mapGetters({
        activeComponent: 'activeComponent',
        game: 'activeGame'
      })
    },

    components: {
      "game-panel":       GamePanel,
      "component-panel":  ComponentPanel,
      "component-editor": ComponentEditor
    },

    methods: { }
  }
</script>

<style>

</style>
