<template lang="pug">
v-expansion-panel-content#dimension-editor
  div(slot="header") Dimensions
  v-card(v-if="size")
    v-card-text
      v-layout(column)
          v-flex
            label Coordinate Mode:
            v-btn-toggle(v-model="dimensionLayout" mandatory)
              v-btn(small flat :value="XYWH") XYWH
              v-btn(small flat :value="INSET") Inset

          v-flex#dimension-unit-selector
            p Units:
            v-btn-toggle(v-model="dimensionUnits" mandatory)
              v-btn(small flat value="percent") %
              v-btn(small flat value="inches") in
              v-btn(small flat value="millimeters") mm
              v-btn(small flat value="pixels") px

          v-flex(v-if="modeXYWH")
            v-layout#layout-xywh(row wrap)
              v-flex
                p Expressed as {{ unitDescription }} from the top left corner.
              v-flex(xs12 md6)
                v-text-field#dim-x(prefix="X" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionX" @blur="roundToUnit('x')" box)
              v-flex(xs12 md6)
                v-text-field#dim-y(prefix="Y" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionY" @blur="roundToUnit('y')" box)
              v-flex(xs12 md6)
                v-text-field#dim-w(prefix="W" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionW" @blur="roundToUnit('w')" box)
              v-flex(xs12 md6)
                v-text-field#dim-h(prefix="H" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionH" @blur="roundToUnit('h')" box)

          v-flex(v-else-if="modeInset")
            v-layout#layout-inset(row wrap)
              v-flex
                p Expressed as {{ unitDescription }} in from the top, right, bottom, and left sides.
              v-flex(md3)
              v-flex(xs12 md6)
                v-text-field#dim-t(prefix="Top" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionT" box)
              v-flex(xs12 md6)
                v-text-field#dim-l(prefix="Left" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionL" box)
              v-flex(xs12 md6)
                v-text-field#dim-r(prefix="Right" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionR" box)
              v-flex(md3)
              v-flex(xs12 md6)
                v-text-field#dim-b(prefix="Bottom" :suffix="unitName" :step='unitStep' type="number" v-model.number="dimensionB" box)
</template>

<script>
  import { isString } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import { XYWH, INSET,
    PERCENT, PIXELS, INCHES, MILLIMETERS } from '../../../store/dimensions.js'

  const VARIABLES = {}
  VARIABLES[PERCENT] = {
    step:        "0.1",
    name:        "%",
    description: "percentage of total width or height",
  }
  VARIABLES[PIXELS] = {
    step:        "1",
    name:        "px",
    description: "pixels",
  }
  VARIABLES[INCHES] = {
    step:        "0.01",
    name:        "in",
    description: "inches",
  }
  VARIABLES[MILLIMETERS] = {
    step:        "1",
    name:        "mm",
    description: "millimeters",
  }

  const
    roundAllToUnit = (dimensionObject, currentUnit) => {
      roundToUnit('x', dimensionObject, currentUnit)
      roundToUnit('y', dimensionObject, currentUnit)
      roundToUnit('w', dimensionObject, currentUnit)
      roundToUnit('h', dimensionObject, currentUnit)
    },

    roundToUnit = (dimensionProperty, dimensionObject, currentUnit) => {
      let fixedPosition
      switch(currentUnit) {
        case "percent":
          fixedPosition = 1
          break
        case "inches":
          fixedPosition = 2
          break
        case "millimeters":
          fixedPosition = 1
          break
        case "pixels":
          fixedPosition = 0
          break
        default:
          throw new Error(`Unrecognized unit: ${currentUnit}`)
      }

      dimensionObject[dimensionProperty] = parseFloat(dimensionObject[dimensionProperty].toFixed(fixedPosition))
    }

  export default {
    props: ["dimensions", "size"],

    data() {
      const dimensionsModel = { ...this.dimensions }
      roundAllToUnit(dimensionsModel, dimensionsModel.units)

      return {
        XYWH, INSET, PERCENT, PIXELS, INCHES, MILLIMETERS,
        dimensionsModel
      }
    },

    computed: {
      dimensionLayout: {
        get() { return this.dimensions.layout || XYWH },
        set(newLayout) {
          this.dimensionsModel.layout = newLayout
          this.updateDimension({ ...this.dimensions, layout: newLayout })}
      },

      dimensionUnits: {
        get() { return this.dimensions.units || PERCENT },
        set(newUnits) {
          const { x, y, w, h, units } = this.dimensions
          this.dimensionsModel.x = this.fromUnitToUnit(x, 'w', 'percent', newUnits)
          this.dimensionsModel.y = this.fromUnitToUnit(y, 'h', 'percent', newUnits)
          this.dimensionsModel.w = this.fromUnitToUnit(w, 'w', 'percent', newUnits)
          this.dimensionsModel.h = this.fromUnitToUnit(h, 'h', 'percent', newUnits)
          this.dimensionsModel.units = newUnits
          this.updateDimension({ ...this.dimensions, units: newUnits })
        }
      },

      modeXYWH() { return this.dimensionLayout == XYWH },
      modeInset() { return this.dimensionLayout == INSET },

      modePercent() { return this.dimensionUnits == PERCENT },
      modeInches() { return this.dimensionUnits == INCHES },
      modeMM() { return this.dimensionUnits == MILLIMETERS },
      modePixels() { return this.dimensionUnits == PIXELS },

      unitStep() { return VARIABLES[this.dimensionUnits].step },
      unitName() { return VARIABLES[this.dimensionUnits].name },
      unitDescription() { return VARIABLES[this.dimensionUnits].description },

      currentUnitWidth() {
        return this.fromUnitToUnit(this.size.w, 'w', 'inches')
      },

      currentUnitHeight() {
        return this.fromUnitToUnit(this.size.h, 'h', 'inches')
      },

      dimensionsId() { return this.dimensions.id },

      dimensionX: {
        get() { return this.dimensionsModel.x },

        set(newX) {
          if(isString(newX) || newX < 0) { newX = 0 }
          this.dimensionsModel.x = newX
          newX = this.fromUnit(newX, 'w')
          this.patchDimension({ id: this.dimensionsId, x: newX })
        }
      },

      dimensionY: {
        get() { return this.dimensionsModel.y },

        set(newY) {
          if(isString(newY) || newY < 0) { newY = 0 }
          this.dimensionsModel.y = newY
          newY = this.fromUnit(newY, 'h')
          this.patchDimension({ id: this.dimensionsId, y: newY })
        }
      },

      dimensionW: {
        get() { return this.dimensionsModel.w },

        set(newW) {
          if(isString(newW) || newW < 0) { newW = 0 }
          this.dimensionsModel.w = newW
          newW = this.fromUnit(newW, 'w')
          this.patchDimension({ id: this.dimensionsId, w: newW })
        }
      },

      dimensionH: {
        get() { return this.dimensionsModel.h },

        set(newH) {
          if(isString(newH) || newH < 0) { newH = 0 }
          this.dimensionsModel.h = newH
          newH = this.fromUnit(newH, 'h')
          this.patchDimension({ id: this.dimensionsId, h: newH })
        }
      },

      dimensionT: {
        get() { return this.dimensionsModel.y },

        set(newT) {
          if(isString(newT) || newT < 0) { newT = 0 }
          const modelHeight = (this.dimensionsModel.h + this.dimensionsModel.y) - newT
          this.dimensionsModel.y = newT
          this.dimensionsModel.h = modelHeight
          newT = this.fromUnit(newT, 'h')
          const newHeight = (this.dimensions.h + this.dimensions.y) - newT
          this.patchDimension({ id: this.dimensionsId, y: newT, h: newHeight })
        }
      },

      dimensionR: {
        get() { return (this.currentUnitWidth - this.dimensionsModel.x - this.dimensionsModel.w) },

        set(newR) {
          if(isString(newR) || newR < 0) { newR = 0 }
          const modelWidth = this.currentUnitWidth - newR - this.dimensionsModel.x
          this.dimensionsModel.w = modelWidth
          newR = this.fromUnit(newR, 'w')
          const newWidth = 100 - newR - this.dimensions.x
          this.patchDimension({ id: this.dimensionsId, w: newWidth })
        }
      },

      dimensionB: {
        get() { return (this.currentUnitHeight - this.dimensionsModel.y - this.dimensionsModel.h) },

        set(newB) {
          if(isString(newB) || newB < 0) { newB = 0 }
          const modelHeight = this.currentUnitHeight - newB - this.dimensionsModel.y
          this.dimensionsModel.h = modelHeight
          newB = this.fromUnit(newB, 'h')
          const newHeight = 100 - newB - this.dimensions.y
          this.patchDimension({ id: this.dimensionsId, h: newHeight })
        }
      },

      dimensionL: {
        get() { return this.dimensionsModel.x },

        set(newL) {
          if(isString(newL) || newL < 0) { newL = 0 }
          const modelWidth = (this.dimensionsModel.w + this.dimensionsModel.x) - newL
          this.dimensionsModel.x = newL
          this.dimensionsModel.w = modelWidth
          newL = this.fromUnit(newL, 'w')
          const newWidth = (this.dimensions.w + this.dimensions.x) - newL
          this.patchDimension({ id: this.dimensionsId, x: newL, w: newWidth })
        }
      },
    },

    methods: {
      ...mapActions(["patchDimension", "updateDimension"]),

      fromUnitToUnit(measure, dimension, fromUnit, toUnit=this.dimensionUnits) {
        const base = this.fromUnit(measure, dimension, fromUnit)
        return this.toUnit(base, dimension, toUnit)
      },

      fromUnit(measure, dimension, currentUnit=this.dimensionUnits) {
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
            return this.fromUnit((measure / 25.4), dimension, 'inches')
            break
          case "pixels":
            return this.fromUnit((measure / 300), dimension, 'inches')
            break
          default:
            throw new Error(`Unrecognized unit: ${currentUnit}`)
        }
      },

      toUnit(measure, dimension, currentUnit=this.dimensionUnits) {
        if(!this.size[dimension]) {
          throw new Error(`Unrecognized dimension: ${dimension}`)
        }

        let stringDimension
        switch(currentUnit) {
          case "percent":
            stringDimension = measure.toFixed(1)
            break
          case "inches":
            stringDimension = (this.size[dimension] * measure * .01).toFixed(2)
            break
          case "millimeters":
            stringDimension = (this.toUnit(measure, dimension, 'inches') * 25.4).toFixed(1)
            break
          case "pixels":
            stringDimension = (this.toUnit(measure, dimension, 'inches') * 300).toFixed(0)
            break
          default:
            throw new Error(`Unrecognized unit: ${currentUnit}`)
        }

        return parseFloat(stringDimension)
      },

      roundToUnit(dimensionProperty, dimensionObject=this.dimensionsModel, currentUnit=this.dimensionUnits) {
        roundToUnit(dimensionProperty, dimensionObject, currentUnit)
      }
    }
  }
</script>
