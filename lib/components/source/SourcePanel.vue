<template lang="pug">
v-flex#source-editor(sm4 md6)
  .headline Spreadsheet

  //- We have a source to work with
  template(v-if="componentSheet")
    .subheading
      spreadsheet-icon(:spreadsheetId="componentSheet.id")
      | {{ componentSheet.name }}

      //- Change this source?
      v-tooltip(top)
        v-btn.edit-spreadsheet(slot="activator" fab small @click="unlinkComponentSheet(component)")
          v-icon edit
        span Select a different Source

      refresh-source-button(:spreadsheet="componentSheet")

      v-select(box label="Worksheet" v-model="worksheetId" :items="worksheetOptions" item-value="id" item-text="title" :error="worksheetId ? false : true")

      v-btn(small v-if="showRowSelection" @click="disableRowSelect") Disable Row Selection
      v-btn(small v-else @click="enableRowSelect") Enable Row Selection

      v-layout(v-if="worksheetId && showRowSelection")
        v-flex(xs-6)
          v-text-field(box label="First Row" v-model="firstRow" type="number" min="2" :max="getRowCount(component)+1")
        v-flex(xs-6)
          v-text-field(box label="Last Row" v-model="lastRow" type="number" min="2" :max="getRowCount(component)+1")

    //- Quantity Property
    v-tooltip(bottom)
      v-select.quantity-property(box slot="activator" v-model="quantityProperty" label="Quantity Property" :items="worksheetPropertyNamesWithNull")
      | A quantity property duplicates an item any number of times.

    //- List of Properties
    .subheading Available Properties
    ul.source-properties
      li(v-for="property in worksheetPropertyNames(spreadsheetId, worksheetId)") {{ property }}

    magic-property-alignment-panel(:magic-properties="worksheetMagicProperties(spreadsheetId, worksheetId)" :template="componentTemplate")

  //- We need to set a source
  template(v-else)
    p
      strong This component needs a Sheet to pull its items from.

    v-btn(small color="primary" @click="pickSheetFromDrive") Explore Drive
    v-btn(small color="primary" @click="createSheetDialog = true") Create New Source
    v-autocomplete(box label="Select Existing Source" v-model="spreadsheetId" :items="allSpreadsheets" item-value="id" item-text="name")

    v-dialog(v-model="createSheetDialog" max-width="500" lazy)
      v-card
        v-card-text
          p Create a new Google Sheet named "{{ component.title }}" in the game folder?

          v-btn(success @click="createSpreadsheetAndLinkSheet") Go
</template>

<script>
  import { map, max, min, pick } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../util/component_helper'
  import { openSheetPicker } from '../../services/google/picker'
  import MagicPropertyAlignmentPanel from './MagicPropertyAlignmentPanel.vue'
  import SpreadsheetIcon from '../icons/SpreadsheetIcon.vue'
  import RefreshSourceButton from './RefreshSourceButton.vue'

  export default {
    props: ["component"],

    components: {
      SpreadsheetIcon,
      MagicPropertyAlignmentPanel,
      RefreshSourceButton,
    },

    updated() {
      this.detectRowSelection()
    },

    data() {
      return {
        createSheetDialog: false,
        showRowSelection: false
      }
    },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "worksheetPropertyNames",
        "worksheetMagicProperties",
        "findComponentSheet",
        "findComponentTemplate",
        "getComponentFolderId",
        "getRowCount",
        "allSpreadsheets"
      ]),

      ...computedVModelUpdateAll("component", "patchComponent", [
        "quantityProperty"
      ]),

      spreadsheetId: {
        get() { return this.component.spreadsheetId },
        set(spreadsheetId) { this.linkComponentSheet({ component: this.component, spreadsheetId }) }
      },

      worksheetId: {
        get() { return this.component.worksheetId },
        set(worksheetId) { this.setComponentWorksheet({ component: this.component, worksheetId }) }
      },

      worksheetPropertyNamesWithNull() {
        return [ { text: 'No Quantity Expansion', value: null },
                 ...this.worksheetPropertyNames(this.spreadsheetId, this.worksheetId) ]
      },

      firstRow: {
        // 2 offset so the user can work in terms of spreadsheet row numbers
        get() { return this.component.worksheetFirstRow+2 },

        set(newFirstRow) {
          // 2 offset so the user can work in terms of spreadsheet row numbers
          newFirstRow -= 2
          const patchProps = {
            worksheetFirstRow: newFirstRow,
            worksheetLastRow: max([this.component.worksheetLastRow, newFirstRow])
          }
          this.patchComponent({ ...this.component,  ...patchProps })
        }
      },

      lastRow: {
        // 2 offset so the user can work in terms of spreadsheet row numbers
        get() { return this.component.worksheetLastRow+2 },

        set(newLastRow) {
          // 2 offset so the user can work in terms of spreadsheet row numbers
          newLastRow -= 2
          const patchProps = {
            worksheetLastRow: newLastRow,
            worksheetFirstRow: min([this.component.worksheetFirstRow, newLastRow])
          }
          this.patchComponent({ ...this.component,  ...patchProps })
        }
      },

      worksheetOptions() {
        return map(this.componentSheet.worksheets, (ws) => pick(ws, ["id", "title"]))
      },

      componentSheet() { return this.findComponentSheet(this.component) },

      componentTemplate() { return this.findComponentTemplate(this.component) },
    },

    methods: {
      ...mapActions([
        "linkComponentSheet",
        "unlinkComponentSheet",
        "setComponentWorksheet",
        "patchComponent",
        "googleCreateSpreadsheet",
      ]),

      pickSheetFromDrive() {
        return openSheetPicker(this.workingDirectoryId)
          .then((spreadsheetId) => {
            if(!spreadsheetId) { return Promise.reject(new Error("No sheet picked.")) }

            return this.linkComponentSheet({
              component: this.component,
              spreadsheetId
            })
          })
      },

      createSpreadsheetAndLinkSheet() {
        return this.googleCreateSpreadsheet({
          name: this.component.title,
          parentId: this.getComponentFolderId(this.component),
        })

        .then((spreadsheetId) => {
          return this.patchComponent({
            id: this.component.id, spreadsheetId
          })
        })
      },

      detectRowSelection() {
        this.showRowSelection =
          this.component.worksheetFirstRow      ||
          this.component.worksheetFirstRow == 0 ||
          this.component.worksheetLastRow       ||
          this.component.worksheetLastRow == 0
      },

      enableRowSelect() {
        this.showRowSelection = true
        this.patchComponent({
          ...this.component,
          worksheetFirstRow: 0,
          worksheetLastRow: this.getRowCount(this.component)-1
        })
      },

      disableRowSelect() {
        this.showRowSelection = false
        this.patchComponent({
          ...this.component,
          worksheetFirstRow: null,
          worksheetLastRow: null
        })
      }
    }
  }
</script>
