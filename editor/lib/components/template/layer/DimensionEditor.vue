<template lang="pug">
fieldset#dimension-editor.fieldset
  legend Dimensions

  ul.menu
    li.menu-text Layout Mode
    li(:class="{'is-active': modeXYWH }")
      a(@click="dimensionMode = 'xywh'") XYWH
    li(:class="{'is-active': modeInset }")
      a(@click="dimensionMode = 'inset'") Inset

  p Expressed as percentage of total width or height.

  template(v-if="modeXYWH")
    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-x")
            strong X%
          input#dimension-x.input-group-field(type="number" v-model.number="dimensionX")

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-y")
            strong Y%
          input#dimension-y.input-group-field(type="number" v-model.number="dimensionY")

    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-w")
            strong W%
          input#dimension-w.input-group-field(type="number" v-model.number="dimensionW")

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-h")
            strong H%
          input#dimension-h.input-group-field(type="number" v-model.number="dimensionH")

  template(v-else-if="modeInset")
    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-t")
            strong Top%
          input#dimension-t.input-group-field(type="number" v-model.number="dimensionT")

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-r")
            strong Right%
          input#dimension-r.input-group-field(type="number" v-model.number="dimensionR")

    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-b")
            strong Bottom%
          input#dimension-b.input-group-field(type="number" v-model.number="dimensionB")

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-l")
            strong Left%
          input#dimension-l.input-group-field(type="number" v-model.number="dimensionL")
</template>

<script>
  import { debounce, isString } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  const INPUT_DELAY_MS = 400

  export default {
    props: ["layer"],

    data() {
      return {
        dimensionMode: 'xywh'
      }
    },

    computed: {
      ...mapGetters(["getLayerDimensions"]),

      modeXYWH() { return this.dimensionMode == 'xywh'},
      modeInset() { return this.dimensionMode == 'inset'},

      dimensions() { return this.getLayerDimensions(this.layer) },

      dimensionX: {
        get() { return this.dimensions.x },

        set(newX) {
          if(isString(newX) || newX < 0) { newX = 0 }
          this.updateDimensionSlowly({ ...this.dimensions, x: newX })
        }
      },

      dimensionY: {
        get() { return this.dimensions.y },

        set(newY) {
          if(isString(newY) || newY < 0) { newY = 0 }
          this.updateDimensionSlowly({ ...this.dimensions, y: newY })
        }
      },

      dimensionW: {
        get() { return this.dimensions.w },

        set(newW) {
          if(isString(newW) || newW < 0) { newW = 0 }
          this.updateDimensionSlowly({ ...this.dimensions, w: newW })
        }
      },

      dimensionH: {
        get() { return this.dimensions.h },

        set(newH) {
          if(isString(newH) || newH < 0) { newH = 0 }
          this.updateDimensionSlowly({ ...this.dimensions, h: newH })
        }
      },

      dimensionT: {
        get() { return this.dimensions.y },

        set(newT) {
          if(isString(newT) || newT < 0) { newT = 0 }
          let newHeight = (this.dimensions.h + this.dimensions.y) - newT
          this.updateDimensionSlowly({ ...this.dimensions, y: newT, h: newHeight })
        }
      },

      dimensionR: {
        get() { return (100 - this.dimensions.x - this.dimensions.w) },

        set(newR) {
          if(isString(newR) || newR < 0) { newR = 0 }
          let newWidth = 100 - newR - this.dimensions.x
          this.updateDimensionSlowly({ ...this.dimensions, w: newWidth })
        }
      },

      dimensionB: {
        get() { return (100 - this.dimensions.y - this.dimensions.h) },

        set(newB) {
          if(isString(newB) || newB < 0) { newB = 0 }
          let newHeight = 100 - newB - this.dimensions.y
          this.updateDimensionSlowly({ ...this.dimensions, h: newHeight })
        }
      },

      dimensionL: {
        get() { return this.dimensions.x },

        set(newL) {
          if(isString(newL) || newL < 0) { newL = 0 }
          let newWidth = (this.dimensions.w + this.dimensions.x) - newL
          this.updateDimensionSlowly({ ...this.dimensions, x: newL, w: newWidth })
        }
      },
    },

    methods: {
      ...mapActions(["updateDimension"]),

      updateDimensionSlowly: debounce(function(dimensions) {
        this.updateDimension(dimensions)
      }, INPUT_DELAY_MS),
    }
  }
</script>

<style>
  .menu {
    font-size: .8em;
  }
</style>
