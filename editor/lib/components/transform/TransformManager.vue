<template lang="pug">
#transform-manager
  h5 Transforms
  hr

  table(v-if="source")
    thead
      th Transform Name:
      th Type:
    tr(v-for="property in sourceProperties(source)")
      td Expose("{{ property }}")
      td Raw

  p(v-else) Select a Source...
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ["component"],

    computed: {
      ...mapGetters(["sourceProperties"]),
      source() { return this.component.source }
    }
  }
</script>
