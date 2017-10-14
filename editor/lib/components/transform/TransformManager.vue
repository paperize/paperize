<template lang="pug">
#transform-manager
  .grid-x
    .small-12
      h5.truncate Transforms

  table(v-if="component")
    thead
      th Transform Name
      th Type
    tr(v-for="transform in transforms(component)")
      td {{ transform.name }}
      td {{ transform.type }}

  p(v-else) Select a Source...
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ["component"],

    computed: {
      ...mapGetters(["transforms"])
    }
  }
</script>
