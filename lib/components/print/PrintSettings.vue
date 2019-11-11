<template lang="pug">
v-card
  v-card-title
    .headline Print Settings

  v-card-text
    //- Layout Modes
    v-radio-group(v-model="printMode")
      strong(slot="label") Layout Mode

      v-tooltip(bottom)
        span(slot="activator")
          v-radio(label="Auto Layout" :value="MODE_AUTO_LAYOUT")
        span This is for most users who want to specify their paper size and have Paperize lay everything out.

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
  import { MODE_AUTO_LAYOUT, MODE_COMPONENT_PER_PAGE, PAGE_DIMENSIONS, ORIENTATIONS } from '../../store/print'

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
        MODE_COMPONENT_PER_PAGE,
        printOptions,
        orientationOptions,
      }
    },

    computed: {
      ...mapGetters(["getPrintSettings"]),

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
      updatePrintSettings: debounce(function(attributes) {
        this.$store.dispatch("updatePrintSettings", attributes)
      }, 200),
    }
  }
</script>