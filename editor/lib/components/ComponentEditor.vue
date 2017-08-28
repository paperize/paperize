<template lang="pug">
div
  h2 Editing: {{ component.title || "[component title not set]" }}
  hr

  .grid-x
    .small-4
      component-source-manager(:component="component")

    #transform-manager.small-4
      h5 Transform Manager
      hr

    #template-manager.small-4
      h5 Template Manager
      hr
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
  import ComponentSourceManager from './ComponentSourceManager.vue'

  export default {
    props: ["component"],

    components: {
      'component-source-manager': ComponentSourceManager
    }
  }
</script>
