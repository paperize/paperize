<template lang="pug">
v-card
  v-card-title
    .headline Print Settings

  v-card-text
    //- Selective component printing
    v-label
      strong Print Which Components?
    v-divider

    v-radio-group(v-model="printSelection")
      v-tooltip(top)
        span(slot="activator")
          v-radio(label="All Components" :value="PRINT_ALL_COMPONENTS")
        span Print all components of the game.

      v-tooltip(top)
        span(slot="activator")
          v-radio(label="Select Components" :value="PRINT_SELECT_COMPONENTS")
        span Select specific components to print.

    v-card.component-selection(v-if="printSelection == PRINT_SELECT_COMPONENTS")
      v-card-text
        v-checkbox(v-model="selectedComponents" hide-details v-for="component in allComponents" :key="component.id" :label="component.title" :value="component.id")

    //- Layout Modes
    v-label
      strong Layout Mode
    v-divider

    v-radio-group(v-model="printMode")
      v-tooltip(bottom)
        span(slot="activator")
          v-radio(label="Auto Layout" :value="MODE_AUTO_LAYOUT")
        span This is for most users who want to specify their paper size and have Paperize lay everything out.

      v-tooltip(bottom)
        span(slot="activator")
          v-radio(label="Tabletop Simulator" :value="MODE_TABLETOP_SIMULATOR")
        span 25x24.5 with 0 margins, this setting is ideal for users looking to convert their PDF to a PNG and then feeding it to the Tabletop Simulator Deck Editor.

      v-tooltip(bottom)
        span(slot="activator")
          v-radio(label="Component Per Page" :value="MODE_COMPONENT_PER_PAGE")
        p This allows advanced users to do their own layout.
        span Paperize will place each component onto a page of its own, sized exactly to the component with no margins. Advanced users can then do their own layout.


    template(v-if="printMode == MODE_AUTO_LAYOUT")
      //- Paper Size
      v-label
        strong Paper Size
      v-divider

      div
        v-btn-toggle(v-model="paperMode")
          v-btn(flat value="standard") Standard Sizes
          v-btn(flat value="custom") Custom Size

      //- Standard Sizes
      div(v-if="paperMode != 'custom'")
        p Most home printers use A4 or Letter paper. Select "Universal" if you'd like a print that will work on either.

        v-select(box label="Size" :items="printOptions" item-text="name" item-value="value" v-model="paper")
        v-select(box label="Orientation" :items="orientationOptions" item-text="name" item-value="value" v-model="orientation")

      //- Custom Size
      template(v-else)
        p Set your own custom page size in inches.

        v-text-field(box v-model.number="paperWidth" label="Width" suffix="in." type="number" step ="0.01" min="0")
        v-text-field(box v-model.number="paperHeight" label="Height" suffix="in." type="number" step ="0.01" min="0")


      v-label
        strong Component Spacing
      v-divider

      v-checkbox(label="Enable Spacing?" v-model="componentSpacing")

      v-label
        strong Merge same size components
      v-divider
        p If you want to print same size components in the same page instead of starting a new one.
      v-checkbox(label="Merge components?" v-model="componentMerging")


      //- Margins
      v-label
        strong Minimum Margins
      v-divider

      p How close to the edge will your printer allow you to print?

      v-text-field(box v-model.number="marginTop" label="Top" suffix="in." type="number" step ="0.01" min="0")
      v-text-field(box v-model.number="marginLeft" label="Left" suffix="in." type="number" step ="0.01" min="0")
      v-text-field(box v-model.number="marginRight" label="Right" suffix="in." type="number" step ="0.01" min="0")
      v-text-field(box v-model.number="marginBottom" label="Bottom" suffix="in." type="number" step ="0.01" min="0")
</template>

<script>
  import { capitalize, find, debounce, map } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import { MODE_AUTO_LAYOUT, MODE_TABLETOP_SIMULATOR, MODE_COMPONENT_PER_PAGE, PAGE_DIMENSIONS,
    ORIENTATIONS, PRINT_ALL_COMPONENTS, PRINT_SELECT_COMPONENTS } from '../../store/print'

  // Construct form-friendly collections from the print sources in the store
  const printOptions = map(PAGE_DIMENSIONS, (dimension, key) => {
    return { ...dimension, value: key}
  }),
    orientationOptions = map(ORIENTATIONS, (orientation) => {
      return { name: capitalize(orientation), value: orientation }
    })

  export default {
    data() {
      return {
        MODE_AUTO_LAYOUT,
        MODE_TABLETOP_SIMULATOR,
        MODE_COMPONENT_PER_PAGE,
        PRINT_ALL_COMPONENTS,
        PRINT_SELECT_COMPONENTS,
        printOptions,
        orientationOptions,
      }
    },

    computed: {
      ...mapGetters(["getPrintSettings", "activeGame", "findAllGameComponents"]),

      allComponents() {
        return this.findAllGameComponents(this.activeGame)
      },

      selectedComponents: {
        get() {
          return this.activeGame.printSettings.componentIdsToPrint
        },

        set(components) {
          const game = this.activeGame
          this.updateGame({
            ...game,
            printSettings: {
              ...game.printSettings,
              componentIdsToPrint: components
            }
          })
        }
      },

      printSelection: {
        get() {
          return this.activeGame.printSettings.componentSelection
        },

        set(selection) {
          const game = this.activeGame
          this.updateGame({
            ...game,
            printSettings: {
              ...game.printSettings,
              componentSelection: selection
            }
          })
        },
      },

      printMode: {
        get() {
          return this.getPrintSettings.mode
        },

        set(mode) {
          this.updatePrintSettings({ mode })
        },
      },

      paperMode: {
        get() {
          return this.paper === "custom" ? "custom" : "standard"
        },

        set(mode) {
          if(mode === "custom") {
            this.paper = "custom"
          } else {
            this.paper = "universal"
          }
        }
      },

      paper: {
        get() {
          return this.getPrintSettings.paper
        },

        set(paper) {
          this.updatePrintSettings({ paper })
        },
      },

      orientation: {
        get() {
          return this.getPrintSettings.orientation
        },

        set(orientation) {
          this.updatePrintSettings({ orientation })
        },
      },

      paperWidth: {
        get() {
          return this.getPrintSettings.width
        },

        set(width) {
          this.updatePrintSettings({ customWidth: width })
        },
      },

      paperHeight: {
        get() {
          return this.getPrintSettings.height
        },

        set(height) {
          this.updatePrintSettings({ customHeight: height })
        },
      },

      componentSpacing: {
        get() {
          return this.getPrintSettings.componentSpacing
        },

        set(componentSpacing) {
          this.updatePrintSettings({ componentSpacing })
        }
      },

      componentMerging: {
        get() {
          return this.getPrintSettings.componentMerging
        },

        set(componentMerging) {
          this.updatePrintSettings({ componentMerging })
        }
      },

      marginTop: {
        get() {
          return this.getPrintSettings.marginTop
        },

        set(marginTop) {
          this.updatePrintSettings({ marginTop })
        }
      },

      marginRight: {
        get() {
          return this.getPrintSettings.marginRight
        },

        set(marginRight) {
          this.updatePrintSettings({ marginRight })
        }
      },

      marginBottom: {
        get() {
          return this.getPrintSettings.marginBottom
        },

        set(marginBottom) {
          this.updatePrintSettings({ marginBottom })
        }
      },

      marginLeft: {
        get() {
          return this.getPrintSettings.marginLeft
        },

        set(marginLeft) {
          this.updatePrintSettings({ marginLeft })
        }
      },

    },

    methods: {
      ...mapActions(["updateGame"]),

      updatePrintSettings: debounce(function(attributes) {
        this.$store.dispatch("updatePrintSettings", attributes)
      }, 200),
    }
  }
</script>

<style scoped>
  .component-selection {
    margin-bottom: 1em;
  }

  .component-selection .v-card__text {
    padding: .5em;
  }

  .v-input--checkbox:first-child {
    margin-top: 0;
  }
</style>
