<template lang="pug">
v-flex#source-editor(sm4 md6)
  .headline Spreadsheet

  //- We have a source to work with
  template(v-if="componentSheet")
    .subtitle-1
      spreadsheet-icon(:spreadsheetId="componentSheet.id")
      | {{ componentSheet.name }}

      //- Refresh Spreadsheet
      refresh-source-button(:spreadsheet="componentSheet")

      //- Change Spreadsheet
      v-tooltip(top)
        template(v-slot:activator="{ on }")
          v-btn.edit-spreadsheet(v-on="on" fab small @click="unlinkComponentSheet(component)")
            v-icon close
        span Select a different Spreadsheet

    template(v-if="componentWorksheet")
      .subtitle-1
        | {{ componentWorksheet.title }}
        //- Change Worksheet
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.edit-spreadsheet(v-on="on" fab small @click="unlinkComponentWorksheet(component)")
              v-icon close
          span Select a different Worksheet

      //- Row Selection
      v-btn(small v-if="showRowSelection" @click="disableRowSelect") Disable Row Selection
      v-btn(small v-else @click="enableRowSelect") Enable Row Selection

      v-layout(v-if="worksheetId && showRowSelection")
        v-flex(xs-6)
          v-text-field(filled label="First Row" v-model="firstRow" type="number" min="2" :max="getRowCount(component)+1")
        v-flex(xs-6)
          v-text-field(filled label="Last Row" v-model="lastRow" type="number" min="2" :max="getRowCount(component)+1")

      //- Quantity Property
      v-tooltip(bottom)
        template(v-slot:activator="{ on }")
          v-select.quantity-property(filled v-on="on" v-model="quantityProperty" label="Quantity Property" :items="worksheetPropertyNamesWithNull")
        | A quantity property duplicates an item any number of times.

      //- List of Properties
      .subtitle-1 Available Properties
      ul.source-properties
        li(v-for="property in worksheetPropertyNames(spreadsheetId, worksheetId)") {{ property }}

      magic-property-alignment-panel(:magic-properties="worksheetMagicProperties(spreadsheetId, worksheetId)" :template="componentTemplate")

    //- Worksheet Select
    template(v-else)
      v-btn(small @click="createWorksheetDialog = true") Create New Worksheet
      v-select(filled label="Select Worksheet" v-model="worksheetId" :items="worksheetOptions" item-value="id" item-text="title" :error="!worksheetId")
      v-dialog(v-model="createWorksheetDialog" max-width="500" lazy)
        v-card
          v-card-text
            v-form(ref="worksheetForm")
              p Add a new worksheet to the Google Sheet "{{ componentSheet.name }}"
              v-text-field(label="Worksheet Name" v-model="worksheetTitle" :rules="[rules.required, rules.noDupes]" )

              v-btn(success @click="createWorksheetDialog = false") Cancel
              v-btn(success color="primary" @click="createAndLinkWorksheet") Create Worksheet

  //- We need to set a source
  template(v-else)
    p
      strong This component needs a Spreadsheet to render items from.

    v-btn(v-if="gameHasSheet" small @click="useGameSheet") Use Game Spreadsheet

    v-autocomplete(filled label="Select Spreadsheet" v-model="spreadsheetId" :items="allSpreadsheets" item-value="id" item-text="name")
</template>

<script>
  import { includes, map, max, min, pick } from 'lodash'
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
      this.validateWorksheetForm()
    },

    data() {
      return {
        createSheetDialog: false,
        createWorksheetDialog: false,
        showRowSelection: false,
        worksheetTitle: this.component.title,
        rules: {
          required: value => !!value || 'Required.',
          noDupes: value => !includes(this.worksheetTitles(this.componentSheet.id), value) || 'No duplicate names.'
        }
      }
    },

    computed: {
      ...mapGetters([
        "workingDirectoryId",
        "worksheetTitles",
        "worksheetPropertyNames",
        "worksheetMagicProperties",
        "findComponentSheet",
        "findComponentTemplate",
        "findSpreadsheetWorksheet",
        "activeGame",
        "gameFolderOrDefault",
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

      gameHasSheet() { return !!this.activeGame.spreadsheetId },

      componentSheet() { return this.findComponentSheet(this.component) },

      componentWorksheet() {
        return this.findSpreadsheetWorksheet(this.componentSheet.id, this.worksheetId)
      },

      componentTemplate() { return this.findComponentTemplate(this.component) },
    },

    methods: {
      ...mapActions([
        "linkComponentSheet",
        "unlinkComponentSheet",
        "setComponentWorksheet",
        "patchComponent",
        "googleCreateSpreadsheet",
        "createComponentSpreadsheetWorksheet",
      ]),

      validateWorksheetForm() {
        this.$refs.worksheetForm && this.$refs.worksheetForm.validate()
      },

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

      useGameSheet() {
        return this.patchComponent({
          id: this.component.id,
          spreadsheetId: this.activeGame.spreadsheetId
        })
      },

      createAndLinkWorksheet() {
        this.createComponentSpreadsheetWorksheet({ component: this.component, worksheetTitle: this.worksheetTitle  })

          .then(() => {
            this.createWorksheetDialog = false
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

      unlinkComponentWorksheet(component) {
        this.setComponentWorksheet({ component, worksheetId: null })
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
