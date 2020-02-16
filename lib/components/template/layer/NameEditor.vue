<template lang="pug">
v-expansion-panel-content
  div(slot="header") Layer Name: "{{ name }}"
  v-card
    v-card-text
      v-text-field.layer-name-input(v-model="name" label="Name" box)
</template>

<script>
  import { computedVModelUpdate } from '../../util/component_helper'

  export default {
    props: ["layer"],

    computed: {
      name: computedVModelUpdate("layer", "patchLayer", "name"),
    },

    methods: mapActions(["patchLayer"]),
  }
</script>
