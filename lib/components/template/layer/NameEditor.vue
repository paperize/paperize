<template lang="pug">
v-expansion-panel
  v-expansion-panel-header Layer Name: "{{ name }}"
  v-expansion-panel-content
    v-card
      v-card-text
        v-text-field.layer-name-input(v-model="name" label="Name" filled)
</template>

<script>
import { mapActions } from 'vuex'
import { computedVModelUpdate } from '../../util/component_helper'

export default {
  props: ["layer"],

  computed: {
    name: computedVModelUpdate("layer", "patchLayer", "name"),
  },

  methods: mapActions(["patchLayer"]),
}
</script>
