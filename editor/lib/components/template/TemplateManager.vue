<template lang="pug">
div(v-if="findComponentTemplate(component)")
  template-editor(:component="component" @close-dialog="$emit('close-dialog')")

div(v-else)
  .grid-x.grid-padding-x
    .small-12.cell
      h2 Template Manager
      hr

    .small-4.cell
      h5 Create a new Template
      a.button(@click="createComponentTemplate(component)") Create

    .small-4.cell
      h5 Load a Paperize Template
      p
        em Coming soon...

    .small-4.cell
      h5 Copy another Template
      p
        em Coming soon...
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TemplateEditor from './TemplateEditor.vue'

  export default {
    props: ["component"],

    components: {
      "template-editor": TemplateEditor
    },

    data() { return { } },

    computed: mapGetters(["findComponentTemplate"]),

    methods: mapActions(["createComponentTemplate"])
  }
</script>
