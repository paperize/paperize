<template lang="pug">
v-flex#source-editor(sm4 md6)
  .headline Source

  //- We have a source to work with
  template(v-if="componentSource")
    .subheading
      | {{ componentSource.name }}

      //- Change this source?
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="pickSheetFromDrive")
          v-icon edit
        span Select a different Source

      //- Refresh this source from Drive?
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="downloadAndSaveSource(componentSource.id)")
          v-icon refresh
        span Refresh (last refresh: {{ lastRefresh }})

      v-select(label="Worksheet" v-model="worksheetId" :items="worksheetNames")

    //- Quantity Property
    v-tooltip(bottom)
      v-select.quantity-property(slot="activator" v-model="quantityProperty" label="Quantity Property" :items="activeSourcePropertiesWithNull")
      | A quantity property duplicates an item any number of times.

    //- List of Properties
    .subheading Available Properties
    ul.source-properties
      li(v-for="property in sourceProperties(componentSource)") {{ property }}

  //- We need to set a source
  template(v-else)
    p
      strong This component does not have a data Source set.

    v-btn(small color="primary" @click="pickSheetFromDrive") Explore Drive
    v-btn(small color="primary" @click="") Create New Source
</template>

<script>
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../util/component_helper'
  import { openDrivePicker } from '../../services/google/picker'

  export default {
    props: ["component"],

    computed: {
      ...mapGetters([
        "sourceProperties",
        "findComponentSource",
        "findComponentTemplate",
        "activeSourceProperties",
        "getSourceWorksheetNames"
      ]),

      ...computedVModelUpdateAll("component", "updateComponent", [
        "worksheetId",
        "quantityProperty"
      ]),

      activeSourcePropertiesWithNull() {
        return [ { text: 'No Quantity Expansion', value: null }, ...this.activeSourceProperties ]
      },

      lastRefresh() {
        return moment(this.componentSource.refreshedAt).fromNow()
      },

      worksheetNames() {
        return this.getSourceWorksheetNames(this.componentSource.id)
      },

      componentSource() { return this.findComponentSource(this.component) },
    },

    methods: {
      ...mapActions(["updateComponent", "linkComponentSource", "downloadAndSaveSource"]),

      pickSheetFromDrive() {
        return openDrivePicker().then((pickedId) => {
          if(pickedId) {
            this.downloadAndSaveSource(pickedId)
              .then((sourceId) => {
                this.linkComponentSource({ component: this.component, sourceId })
              })
          }
        })
      }
    }
  }
</script>
