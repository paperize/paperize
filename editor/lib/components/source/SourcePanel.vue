<template lang="pug">
v-flex#source-editor(sm4 md6)
  .headline Source

  template(v-if="componentSource")
    .subheading
      | {{ componentSource.name }}
      v-btn(fab small @click="showSourceManager = true")
        v-icon edit

    v-tooltip(top)
      v-select.quantity-property(slot="activator" v-model="quantityProperty" label="Quantity Property" :items="activeSourceProperties")
      | A quantity property duplicates an item any number of times.

    .subheading Available Properties
    ul.source-properties
      li(v-for="property in sourceProperties(componentSource)") {{ property }}

  template(v-else)
    p
      strong This component does not have a data Source set.

    v-btn(small color="primary" @click="showSourceManager = true") Set a Source...

  v-dialog(v-model="showSourceManager" lazy max-width="550")
    source-manager(:component="component" @close-dialog="showSourceManager = false")
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { computedVModelUpdate } from '../util/component_helper'
  import SourceManager from './SourceManager.vue'

  export default {
    props: ["component"],

    components: { SourceManager },

    data() {
      return {
        showSourceManager: false
      }
    },

    computed: {
      ...mapGetters([
        "sourceProperties",
        "findComponentSource",
        "findComponentTemplate",
        "activeSourceProperties"
      ]),

      quantityProperty: computedVModelUpdate("component", "updateComponent", "quantityProperty"),

      componentSource() { return this.findComponentSource(this.component) },
    },

    methods: mapActions(["updateComponent"])
  }
</script>
