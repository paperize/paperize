<template lang="pug">
template-editor(v-if="findComponentTemplate(component)" :component="component" @close-dialog="$emit('close-dialog')")

v-card(v-else)
  v-card-title
    .headline Template Manager

  v-card-text
    v-layout
      v-flex(sm4)
        .subtitle-1 Create a new Template
        v-btn(@click="createComponentTemplate(component)") Create

      v-flex(sm4)
        .subtitle-1 Load a Paperize Template
        p
          em Coming soon...

      v-flex(sm4)
        .subtitle-1 Copy another Template
        p
          em Coming soon...
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TemplateEditor from './TemplateEditor.vue'

  export default {
    props: ["component"],

    components: { TemplateEditor },

    data() { return { } },

    computed: mapGetters(["findComponentTemplate"]),

    methods: mapActions(["createComponentTemplate"])
  }
</script>
