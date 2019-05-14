<template lang="pug">
v-expansion-panel-content#dimension-editor
  div(slot="header") Dimensions
  v-card
    v-card-text
      v-layout(column)
          v-flex
            label Coordinate Mode:
            v-btn-toggle(v-model="dimensionMode" mandatory)
              v-btn(small flat value="xywh") XYWH
              v-btn(small flat value="inset") Inset

          v-flex
            p Units:
            v-btn-toggle(v-model="unitMode" mandatory)
              v-btn(small flat value="percent") %
              v-btn(small flat value="inches") in
              v-btn(small flat value="millimeters") mm
              v-btn(small flat value="pixels") px

          v-flex(v-if="modeXYWH")
            v-layout(row wrap)
              v-flex
                p Expressed as {{ unitDescription }} from the top left corner.
              v-flex(xs12 md6)
                v-text-field#dim-x(prefix="X" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionX" box)
              v-flex(xs12 md6)
                v-text-field#dim-y(prefix="Y" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionY" box)
              v-flex(xs12 md6)
                v-text-field#dim-w(prefix="W" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionW" box)
              v-flex(xs12 md6)
                v-text-field#dim-h(prefix="H" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionH" box)

          v-flex(v-else-if="modeInset")
            v-layout(row wrap)
              v-flex
                p Expressed as {{ unitDescription }} in from the top, right, bottom, and left sides.
              v-flex(xs12)
                v-text-field#dim-t(prefix="T" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionT" box)
              v-flex(xs12 md6)
                v-text-field#dim-l(prefix="L" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionL" box)
              v-flex(xs12 md6)
                v-text-field#dim-r(prefix="R" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionR" box)
              v-flex(xs12)
                v-text-field#dim-b(prefix="B" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionB" box)
</template>

<script>
  import { isString } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ["layer"],

    data() {
      return {
        dimensionMode: 'xywh',
        unitMode: 'percent'
      }
    },

    computed: {
      ...mapGetters(["getLayerDimensions", "findTemplateByLayerId"]),

      size() { return this.findTemplateByLayerId(this.layer.id).size },

      modeXYWH() { return this.dimensionMode == 'xywh' },
      modeInset() { return this.dimensionMode == 'inset' },

      modePercent() { return this.unitMode == 'percent' },
      modeInches() { return this.unitMode == 'inches' },
      modeMM() { return this.unitMode == 'millimeters' },
      modePixels() { return this.unitMode == 'pixels' },

      unitStep() {
        switch(this.unitMode) {
          case "percent": return "0.1"; break;
          case "inches": return "0.01"; break;
          case "millimeters": return "1"; break;
          case "pixels": return "1"; break;
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

      dimensionsId() { return this.dimensions.id },

      dimensionX: {
        get() { return this.toCurrentUnit(this.dimensions.x, 'w') },

        set(newX) {
          if(isString(newX) || newX < 0) { newX = 0 }
          newX = this.fromCurrentUnit(newX, 'w')
          this.patchDimension({ id: this.dimensionsId, x: newX })
        }
      },

      dimensionY: {
        get() { return this.toCurrentUnit(this.dimensions.y, 'h') },

        set(newY) {
          if(isString(newY) || newY < 0) { newY = 0 }
          newY = this.fromCurrentUnit(newY, 'h')
          this.patchDimension({ id: this.dimensionsId, y: newY })
        }
      },

      dimensionW: {
        get() { return this.toCurrentUnit(this.dimensions.w, 'w') },

        set(newW) {
          if(isString(newW) || newW < 0) { newW = 0 }
          newW = this.fromCurrentUnit(newW, 'w')
          this.patchDimension({ id: this.dimensionsId, w: newW })
        }
      },

      dimensionH: {
        get() { return this.toCurrentUnit(this.dimensions.h, 'h') },

        set(newH) {
          if(isString(newH) || newH < 0) { newH = 0 }
          newH = this.fromCurrentUnit(newH, 'h')
          this.patchDimension({ id: this.dimensionsId, h: newH })
        }
      },

      dimensionT: {
        get() { return this.toCurrentUnit(this.dimensions.y, 'h') },

        set(newT) {
          if(isString(newT) || newT < 0) { newT = 0 }
          newT = this.fromCurrentUnit(newT, 'h')
          let newHeight = (this.dimensions.h + this.dimensions.y) - newT
          this.patchDimension({ id: this.dimensionsId, y: newT, h: newHeight })
        }
      },

      dimensionR: {
        get() { return this.toCurrentUnit((100 - this.dimensions.x - this.dimensions.w), 'w') },

        set(newR) {
          if(isString(newR) || newR < 0) { newR = 0 }
          newR = this.fromCurrentUnit(newR, 'w')
          let newWidth = 100 - newR - this.dimensions.x
          this.patchDimension({ id: this.dimensionsId, w: newWidth })
        }
      },

      dimensionB: {
        get() { return this.toCurrentUnit((100 - this.dimensions.y - this.dimensions.h), 'h') },

        set(newB) {
          if(isString(newB) || newB < 0) { newB = 0 }
          newB = this.fromCurrentUnit(newB, 'h')
          let newHeight = 100 - newB - this.dimensions.y
          this.patchDimension({ id: this.dimensionsId, h: newHeight })
        }
      },

      dimensionL: {
        get() { return this.toCurrentUnit(this.dimensions.x, 'w') },

        set(newL) {
          if(isString(newL) || newL < 0) { newL = 0 }
          newL = this.fromCurrentUnit(newL, 'w')
          let newWidth = (this.dimensions.w + this.dimensions.x) - newL
          this.patchDimension({ id: this.dimensionsId, x: newL, w: newWidth })
        }
      },
    },

    methods: {
      ...mapActions(["patchDimension"]),

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
      }
    }
  }
</script>
