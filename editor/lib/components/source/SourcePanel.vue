<template lang="pug">
v-flex#source-editor(sm4 md6)
  .headline Source

  template(v-if="componentSource")
    .subheading
      | {{ componentSource.name }}
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="pickSheetFromDrive")
          v-icon edit
        span Select a different Source
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="downloadAndSaveSource(componentSource.id)")
          v-icon refresh
        span Refresh (last refresh: {{ lastRefresh }})

    v-tooltip(bottom)
      v-select.quantity-property(slot="activator" v-model="quantityProperty" label="Quantity Property" :items="activeSourceProperties")
      | A quantity property duplicates an item any number of times.

    .subheading Available Properties
    ul.source-properties
      li(v-for="property in sourceProperties(componentSource)") {{ property }}

  template(v-else)
    p
      strong This component does not have a data Source set.

    v-btn(small color="primary" @click="pickSheetFromDrive") Explore Drive
    v-btn(small color="primary" @click="") Create New Source
</template>

<script>
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'
  import { computedVModelUpdate } from '../util/component_helper'
  import { openDrivePicker } from '../../services/google/picker'

  export default {
    props: ["component"],

    computed: {
      ...mapGetters([
        "sourceProperties",
        "findComponentSource",
        "findComponentTemplate",
        "activeSourceProperties"
      ]),

      lastRefresh() {
        return moment(this.componentSource.refreshedAt).fromNow()
      },

      quantityProperty: computedVModelUpdate("component", "updateComponent", "quantityProperty"),

      componentSource() { return this.findComponentSource(this.component) },
    },

    methods: {
      ...mapActions(["updateComponent", "linkComponentSource", "downloadAndSaveSource"]),

      pickSheetFromDrive() {
        return openDrivePicker().then((pickedId) => {
          if(pickedId) {
            this.downloadAndSaveSource(pickedId)
              .then((sourceId) => {
                this.linkComponentSource({ component: this.component, source: sourceId })
              })
          }
        })
      }
    }
  }
</script>
