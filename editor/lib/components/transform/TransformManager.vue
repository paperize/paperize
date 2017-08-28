<template lang="pug">
#transform-manager
  h5 Transform Manager
  hr

  p Transforms:
  table(v-if="source")
    thead
      th Name:
      th Type:
    tr(v-for="property in sourceProperties(source)")
      td Expose("{{ property }}")
      td Raw
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
