<template lang="pug">
modal(name="Print Settings" height="auto" :pivotY="0.25")
  .grid-x.grid-padding-x
    .small-12.cell
      h1 Print Settings

    //- Paper Size
    .small-12.cell
      fieldset.fieldset
        legend
          strong Paper Size

        .grid-x.grid-padding-x
          .small-12.cell
            ul.menu
              li.menu-text Configure Paper Size:
              li(:class="{ 'is-active': paperMode == 'standard' }")
                a(@click="setPaperMode('standard')") Standard Sizes
              li(:class="{ 'is-active': paperMode == 'custom' }")
                a(@click="setPaperMode('custom')") Custom Size

            hr

          //- Standard Sizes
          template(v-if="paperMode == 'standard'")
            .small-12.cell
              p Most home printers use A4 or Letter paper. Select "Universal" if you'd like a print that will work on either.

            .small-6.cell
              .input-group
                span.input-group-label(title="inches") Size
                select.input-group-field(id="paper-format" @change="updatePageDimensions" v-model.number="paperFormat")
                  option()
                  option(v-for="printOption in standardPrintOptions" :value="printOption.value") {{ printOption.name }}

            .small-6.cell
              .input-group
                span.input-group-label(title="inches") Orientation
                select.input-group-field(id="paper-orientation" @change="updatePageDimensions" v-model.number="paperOrientation")
                  option(value="portrait") Portrait
                  option(value="landscape") Landscape

          //- Custom Size
          template(v-else)
            .small-12.cell
              p Set your own custom page size in inches.

            .small-6.cell
              .input-group
                span.input-group-label(title="inches") Width
                input.input-group-field(id="paper-width" type="number" step="0.01" min="0" v-model.number="paperWidth")
                span.input-group-label(title="inches") in.

            .small-6.cell
              .input-group
                span.input-group-label Height
                input.input-group-field(id="paper-width" type="number" step="0.01" min="0" v-model.number="paperHeight")
                span.input-group-label(title="inches") in.

    //- Margins
    .small-12.cell
      fieldset.fieldset
        legend
          strong Minimum Margins

        p How close to the edge will your printer allow you to print?

        .grid-x
          .auto.cell
          .small-4.cell
            .input-group
              span.input-group-label(title="Top Margin")
                i.fas.fa-arrow-down
              input.input-group-field(type="number" step="0.01" min="0" v-model.number="marginTop")
              span.input-group-label(title="inches") in.
          .auto.cell

        .grid-x
          .small-4.cell
            .input-group
              span.input-group-label(title="Left Margin")
                i.fas.fa-arrow-right
              input.input-group-field(type="number" step="0.01" min="0" v-model.number="marginLeft")
              span.input-group-label(title="inches") in.
          .auto.cell
          .small-4.cell
            .input-group
              span.input-group-label(title="Right Margin")
                i.fas.fa-arrow-left
              input.input-group-field(type="number" step="0.01" min="0" v-model.number="marginRight")
              span.input-group-label(title="inches") in.

        .grid-x
          .auto.cell
          .small-4.cell
            .input-group
              span.input-group-label(title="Left Margin")
                i.fas.fa-arrow-up
              input.input-group-field(type="number" step="0.01" min="0" v-model.number="marginBottom")
              span.input-group-label(title="inches") in.
          .auto.cell

  button.close-button(aria-label="Close modal" type="button" @click="$modal.hide('Print Settings')")
    span(aria-hidden="true") &times;
</template>

<script>
  import { find, debounce } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  let standardPrintOptions = [
    { value: 'a4', name: 'A4',
      width: 8.3, height: 11.7 },
    { value: 'letter', name: 'Letter',
      width: 8.5, height: 11 },
    { value: 'universal', name: 'Universal',
      width: 8.3, height: 11 },
  ]

  export default {
    data() {
      return {
        standardPrintOptions,
        paperMode: 'standard',
        paperFormat: '',
        paperOrientation: 'portrait',
      }
    },

    computed: {
      ...mapGetters(["getPrintSettings"]),

      paperWidth: {
        get() {
          return this.getPrintSettings.width
        },

        set(width) {
          this.updatePrintSettings({ width })
        },
      },

      paperHeight: {
        get() {
          return this.getPrintSettings.height
        },

        set(height) {
          this.updatePrintSettings({ height })
        },
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

      setPaperMode(mode) {
        this.paperMode = mode

        if(this.paperMode != "standard") {
          this.paperFormat = ""
          this.paperOrientation = "portrait"
        }
      },

      updatePageDimensions() {
        if(this.paperFormat.length == 0) { return }

        let format = find(standardPrintOptions, { value: this.paperFormat })
          , width = format.width
          , height = format.height
          , smallerDimension = Math.min(width, height)
          , largerDimension = Math.max(width, height)

        if(this.paperOrientation == 'portrait') {
          this.updatePrintSettings({
            width: smallerDimension,
            height: largerDimension
          })

        } else if(this.paperOrientation == 'landscape') {
          this.updatePrintSettings({
            width: largerDimension,
            height: smallerDimension
          })
        }
      }
    }
  }
</script>
