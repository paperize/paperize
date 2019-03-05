<template lang="pug">
v-flex#source-editor(sm4 md6)
  .headline Source

  //- We have a source to work with
  template(v-if="componentSource")
    .subheading
      sheet-icon(:sheetId="componentSource.id")
      | {{ componentSource.name }}

      //- Change this source?
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="unlinkComponentSource(component)")
          v-icon edit
        span Select a different Source

      //- Refresh this source from Drive?
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="downloadAndSaveSource(componentSource.id)")
          v-icon refresh
        span Refresh (last refresh: {{ lastRefresh }})

      v-select(box label="Worksheet" v-model="worksheetId" :items="worksheetNames")

    //- Quantity Property
    v-tooltip(bottom)
      v-select.quantity-property(box slot="activator" v-model="quantityProperty" label="Quantity Property" :items="activeSourcePropertiesWithNull")
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
    v-btn(small color="primary" @click="createSourceDialog = true") Create New Source
    v-select(box label="Select Existing Source" v-model="sourceId" :items="allSources" item-value="id" item-text="name")

    v-dialog(v-model="createSourceDialog" max-width="500" lazy)
      v-card
        v-card-text
          p Create a new Google Sheet named "{{ component.title }}" in the game folder?

          v-btn(success @click="createSpreadsheetAndSetSourceId") Go
</template>

<script>
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../util/component_helper'
  import { openSheetPicker } from '../../services/google/picker'
  import SheetIcon from '../icons/SheetIcon.vue'

  export default {
    props: ["component"],

    components: {
      SheetIcon
    },

    data() {
      return {
        createSourceDialog: false
      }
    },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "sourceProperties",
        "findComponentSource",
        "findComponentTemplate",
        "activeSourceProperties",
        "getSourceWorksheetNames",
        "getComponentFolderId",
        "allSources"
      ]),

      ...computedVModelUpdateAll("component", "updateComponent", [
        "quantityProperty"
      ]),

      sourceId: {
        get() { return this.component.sourceId },
        set(sourceId) { this.linkComponentSource({ component: this.component, sourceId }) }
      },

      worksheetId: {
        get() { return this.component.worksheetId },
        set(worksheetId) { this.setComponentWorksheet({ component: this.component, worksheetId }) }
      },

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
      ...mapActions([
        "updateComponent",
        "linkComponentSource",
        "unlinkComponentSource",
        "downloadAndSaveSource",
        "setComponentWorksheet"
      ]),

      pickSheetFromDrive() {
        return openSheetPicker(this.workingDirectoryId).then((pickedId) => {
          if(pickedId) {
            this.downloadAndSaveSource(pickedId)
              .then((sourceId) => {
                this.linkComponentSource({ component: this.component, sourceId })
              })
          }
        })
      },

      createSpreadsheetAndSetSourceId() {
        return this.$store.dispatch("googleCreateSpreadsheet", {
          name: this.component.title,
          parentId: this.getComponentFolderId(this.component),
        })

        .then((spreadsheetId) => {
          return this.$store.dispatch("patchComponent", {
            id: this.component.id,
            sourceId: spreadsheetId
          })
        })
      },
    }
  }
</script>
