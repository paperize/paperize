<template lang="pug">
#transform-manager
  .grid-x
    .small-12
      h5.truncate Transforms

  table(v-if="component")
    thead
      tr
        th Order
        th (x, y), (w, h)
    tbody
      tr(v-for="transform in getComponentTransforms(component)")
        td {{ transform.renderOrder }}
        td {{ `(${transform.dimensions.x}, ${transform.dimensions.y}), (${transform.dimensions.w}, ${transform.dimensions.h})` }}

  p(v-else) Select a Source...
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ["component"],

    computed: {
      ...mapGetters(["getComponentTransforms"])
    }
  }
</script>
