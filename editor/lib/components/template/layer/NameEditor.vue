<template lang="pug">
v-expansion-panel-content
  div(slot="header") Layer Name: "{{ name }}"
  v-card
    v-card-text
      v-text-field(v-model="name" label="Name" box)
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
