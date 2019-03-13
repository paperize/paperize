<template lang="pug">
v-flex#source-editor(sm4 md6)
  .headline Source

  //- We have a source to work with
  template(v-if="componentSheet")
    .subheading
      sheet-icon(:sheetId="componentSheet.id")
      | {{ componentSheet.name }}

      //- Change this source?
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="unlinkComponentSheet(component)")
          v-icon edit
        span Select a different Source

      //- Refresh this source from Drive?
      v-tooltip(top)
        v-btn(slot="activator" fab small @click="refreshSheetNow(componentSheet.id)")
          v-icon refresh
        span Refresh (last refresh: {{ lastRefresh }})

      v-select(box label="Worksheet" v-model="worksheetId" :items="worksheetNames")

    //- Quantity Property
    v-tooltip(bottom)
      v-select.quantity-property(box slot="activator" v-model="quantityProperty" label="Quantity Property" :items="activeSheetPropertiesWithNull")
      | A quantity property duplicates an item any number of times.

    //- List of Properties
    .subheading Available Properties
    ul.source-properties
      li(v-for="property in sheetProperties(componentSheet)") {{ property }}

  //- We need to set a source
  template(v-else)
    p
      strong This component needs a Sheet to pull its items from.

    v-btn(small color="primary" @click="pickSheetFromDrive") Explore Drive
    v-btn(small color="primary" @click="createSheetDialog = true") Create New Source
    v-select(box label="Select Existing Source" v-model="sheetId" :items="allSheets" item-value="id" item-text="name")

    v-dialog(v-model="createSheetDialog" max-width="500" lazy)
      v-card
        v-card-text
          p Create a new Google Sheet named "{{ component.title }}" in the game folder?

          v-btn(success @click="createSpreadsheetAndLinkSheet") Go
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
        createSheetDialog: false
      }
    },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "sheetProperties",
        "findComponentSheet",
        "findComponentTemplate",
        "activeSheetProperties",
        // "worksheetNames",
        "getComponentFolderId",
        "allSheets"
      ]),

      ...computedVModelUpdateAll("component", "updateComponent", [
        "quantityProperty"
      ]),

      sheetId: {
        get() { return this.component.sheetId },
        set(sheetId) { this.linkComponentSheet({ component: this.component, sheetId }) }
      },

      worksheetId: {
        get() { return this.component.worksheetId },
        set(worksheetId) { this.setComponentWorksheet({ component: this.component, worksheetId }) }
      },

      activeSheetPropertiesWithNull() {
        return [ { text: 'No Quantity Expansion', value: null }, ...this.activeSheetProperties ]
      },

      lastRefresh() {
        return moment(this.componentSheet.refreshedAt).fromNow()
      },

      worksheetNames() {
        return this.$store.getters.worksheetNames(this.componentSheet.id)
      },

      componentSheet() { return this.findComponentSheet(this.component) },
    },

    methods: {
      ...mapActions([
        "updateComponent",
        "linkComponentSheet",
        "unlinkComponentSheet",
        "setComponentWorksheet",
        "patchComponent",
        "googleCreateSpreadsheet",
      ]),

      pickSheetFromDrive() {
        return openSheetPicker(this.workingDirectoryId)
          .then((sheetId) => {
            if(!sheetId) { return Promise.reject(new Error("No sheet picked.")) }

            return this.linkComponentSheet({
              component: this.component,
              sheetId
            })
          })
      },

      createSpreadsheetAndLinkSheet() {
        return this.googleCreateSpreadsheet({
          name: this.component.title,
          parentId: this.getComponentFolderId(this.component),
        })

        .then((sheetId) => {
          return this.patchComponent({
            id: this.component.id, sheetId
          })
        })
      },
    }
  }
</script>
