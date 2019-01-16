<template lang="pug">
  v-text-field(v-model="name" label="Name")
</template>

<script>
  import { mapActions } from 'vuex'
  import { computedVModelUpdate } from '../../util/component_helper'

  export default {
    props: ["layer"],

    computed: {
      name: computedVModelUpdate("layer", "updateLayer", "name"),
    },

    methods: mapActions(["updateLayer"]),
  }
</script>
