<template lang="pug">
#transform-manager
  .grid-x
    .small-10
      h5.truncate Transforms

    .small-2
      a.button.tiny.success(@click="addTransform(component)")
        i.fa.fa-plus

  table(v-if="component")
    thead
      tr
        th Order
        th Type
        th
    tbody
      tr(v-for="transform in getComponentTransforms(component)")
        td {{ transform.renderOrder }}
        td Code
        td
          a(@click="$modal.show(`Transform ${transform.renderOrder}`)")
            i.fa.fa-pencil
          = " "
          a(@click="deleteTransform({ component, transform })")
            i.fa.fa-remove

          transform-editor(:transform="transform")
  p(v-else) Select a Source...
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import TransformEditor from './TransformEditor.vue'

  export default {
    props: ["component"],

    components: {
      "transform-editor": TransformEditor
    },

    computed: mapGetters(["getComponentTransforms"]),

    methods: mapActions(["addTransform", "deleteTransform"])
  }
</script>
