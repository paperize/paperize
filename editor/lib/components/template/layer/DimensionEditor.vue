<template lang="pug">
fieldset#dimension-editor.fieldset
  legend Dimensions

  ul.menu
    li.menu-text Layout
    li(:class="{'is-active': modeXYWH }")
      a(@click="dimensionMode = 'xywh'") XYWH
    li(:class="{'is-active': modeInset }")
      a(@click="dimensionMode = 'inset'") Inset

  ul.menu
    li.menu-text Units
    li(:class="{'is-active': modePercent }")
      a(@click="unitMode = 'percent'") %
    li(:class="{'is-active': modeInches }")
      a(@click="unitMode = 'inches'") in
    li(:class="{'is-active': modeMM }")
      a(@click="unitMode = 'millimeters'") mm
    li(:class="{'is-active': modePixels }")
      a(@click="unitMode = 'pixels'") px


  template(v-if="modeXYWH")
    p.mode-description Expressed as {{ unitDescription }} from the top left corner.

    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-x")
            strong X
          input#dimension-x.input-group-field(type="number" :step='unitStep' v-model.number="dimensionX")
          label.input-group-label(for="dimension-x")
            strong {{ unitName }}

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-y")
            strong Y
          input#dimension-y.input-group-field(type="number" :step='unitStep' v-model.number="dimensionY")
          label.input-group-label(for="dimension-y")
            strong {{ unitName }}

    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-w")
            strong W
          input#dimension-w.input-group-field(type="number" :step='unitStep' v-model.number="dimensionW")
          label.input-group-label(for="dimension-w")
            strong {{ unitName }}

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-h")
            strong H
          input#dimension-h.input-group-field(type="number" :step='unitStep' v-model.number="dimensionH")
          label.input-group-label(for="dimension-h")
            strong {{ unitName }}

  template(v-else-if="modeInset")
    p.mode-description Expressed as {{ unitDescription }} in from the top, right, bottom, and left sides.

    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-t")
            strong Top
          input#dimension-t.input-group-field(type="number" :step='unitStep' v-model.number="dimensionT")
          label.input-group-label(for="dimension-t")
            strong {{ unitName }}

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-r")
            strong Right
          input#dimension-r.input-group-field(type="number" :step='unitStep' v-model.number="dimensionR")
          label.input-group-label(for="dimension-r")
            strong {{ unitName }}

    .grid-x.grid-padding-x
      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-b")
            strong Bottom
          input#dimension-b.input-group-field(type="number" :step='unitStep' v-model.number="dimensionB")
          label.input-group-label(for="dimension-b")
            strong {{ unitName }}

      .medium-12.large-6.cell
        .input-group
          label.input-group-label(for="dimension-l")
            strong Left
          input#dimension-l.input-group-field(type="number" :step='unitStep' v-model.number="dimensionL")
          label.input-group-label(for="dimension-l")
            strong {{ unitName }}
</template>

<script>
  import { debounce, isString } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  const INPUT_DELAY_MS = 400

  export default {
    props: ["layer", "size"],

    data() {
      return {
        dimensionMode: 'xywh',
        unitMode: 'percent'
      }
    },

    computed: {
      ...mapGetters(["getLayerDimensions"]),

      modeXYWH() { return this.dimensionMode == 'xywh'},
      modeInset() { return this.dimensionMode == 'inset'},

      modePercent() { return this.unitMode == 'percent'},
      modeInches() { return this.unitMode == 'inches'},
      modeMM() { return this.unitMode == 'millimeters'},
      modePixels() { return this.unitMode == 'pixels'},

      unitStep() {
        switch(this.unitMode) {
          case "percent": return "0.1"; break;
          case "inches": return "0.01"; break;
          case "millimeters": return "1"; break;
          case "pixels": return "2"; break;
        }
      },

      unitName() {
        switch(this.unitMode) {
          case "percent": return "%"; break;
          case "inches": return "in"; break;
          case "millimeters": return "mm"; break;
          case "pixels": return "px"; break;
        }
      },

      unitDescription() {
        switch(this.unitMode) {
          case "percent": return "percentage of total width or height"; break;
          case "inches": return "inches"; break;
          case "millimeters": return "millimeters"; break;
          case "pixels": return "pixels"; break;
        }
      },

      dimensions() { return this.getLayerDimensions(this.layer) },

      dimensionX: {
        get() { return this.toCurrentUnit(this.dimensions.x, 'w') },

        set(newX) {
          if(isString(newX) || newX < 0) { newX = 0 }
          newX = this.fromCurrentUnit(newX, 'w')
          this.updateDimensionSlowly({ ...this.dimensions, x: newX })
        }
      },

      dimensionY: {
        get() { return this.toCurrentUnit(this.dimensions.y, 'h') },

        set(newY) {
          if(isString(newY) || newY < 0) { newY = 0 }
          newY = this.fromCurrentUnit(newY, 'h')
          this.updateDimensionSlowly({ ...this.dimensions, y: newY })
        }
      },

      dimensionW: {
        get() { return this.toCurrentUnit(this.dimensions.w, 'w') },

        set(newW) {
          if(isString(newW) || newW < 0) { newW = 0 }
          newW = this.fromCurrentUnit(newW, 'w')
          this.updateDimensionSlowly({ ...this.dimensions, w: newW })
        }
      },

      dimensionH: {
        get() { return this.toCurrentUnit(this.dimensions.h, 'h') },

        set(newH) {
          if(isString(newH) || newH < 0) { newH = 0 }
          newH = this.fromCurrentUnit(newH, 'h')
          this.updateDimensionSlowly({ ...this.dimensions, h: newH })
        }
      },

      dimensionT: {
        get() { return this.toCurrentUnit(this.dimensions.y, 'h') },

        set(newT) {
          if(isString(newT) || newT < 0) { newT = 0 }
          newT = this.fromCurrentUnit(newT, 'h')
          let newHeight = (this.dimensions.h + this.dimensions.y) - newT
          this.updateDimensionSlowly({ ...this.dimensions, y: newT, h: newHeight })
        }
      },

      dimensionR: {
        get() { return this.toCurrentUnit((100 - this.dimensions.x - this.dimensions.w), 'w') },

        set(newR) {
          if(isString(newR) || newR < 0) { newR = 0 }
          newR = this.fromCurrentUnit(newR, 'w')
          let newWidth = 100 - newR - this.dimensions.x
          this.updateDimensionSlowly({ ...this.dimensions, w: newWidth })
        }
      },

      dimensionB: {
        get() { return this.toCurrentUnit((100 - this.dimensions.y - this.dimensions.h), 'h') },

        set(newB) {
          if(isString(newB) || newB < 0) { newB = 0 }
          newB = this.fromCurrentUnit(newB, 'h')
          let newHeight = 100 - newB - this.dimensions.y
          this.updateDimensionSlowly({ ...this.dimensions, h: newHeight })
        }
      },

      dimensionL: {
        get() { return this.toCurrentUnit(this.dimensions.x, 'w') },

        set(newL) {
          if(isString(newL) || newL < 0) { newL = 0 }
          newL = this.fromCurrentUnit(newL, 'w')
          let newWidth = (this.dimensions.w + this.dimensions.x) - newL
          this.updateDimensionSlowly({ ...this.dimensions, x: newL, w: newWidth })
        }
      },
    },

    methods: {
      ...mapActions(["updateDimension"]),

      fromCurrentUnit(measure, dimension, currentUnit=this.unitMode) {
        if(!this.size[dimension]) {
          throw new Error(`Unrecognized dimension: ${dimension}`)
        }

        switch(currentUnit) {
          case "percent":
            return measure
            break
          case "inches":
            return measure / this.size[dimension] * 100
            break
          case "millimeters":
            return this.fromCurrentUnit((measure / 25.4), dimension, 'inches')
            break
          case "pixels":
            return this.fromCurrentUnit((measure / 300), dimension, 'inches')
            break
          default:
            throw new Error(`Unrecognized unit: ${measure}`)
        }
      },

      toCurrentUnit(measure, dimension, currentUnit=this.unitMode) {
        if(!this.size[dimension]) {
          throw new Error(`Unrecognized dimension: ${dimension}`)
        }

        switch(currentUnit) {
          case "percent":
            return measure.toFixed(1)
            break
          case "inches":
            return (this.size[dimension] * measure * .01).toFixed(2)
            break
          case "millimeters":
            return (this.toCurrentUnit(measure, dimension, 'inches') * 25.4).toFixed(1)
            break
          case "pixels":
            return (this.toCurrentUnit(measure, dimension, 'inches') * 300).toFixed(0)
            break
          default:
            throw new Error(`Unrecognized unit: ${measure}`)
        }
      },

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

  .mode-description {
    font-size: .8em;
  }
</style>
