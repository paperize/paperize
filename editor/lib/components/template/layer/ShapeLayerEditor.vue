<template lang="pug">
div
  fieldset.fieldset
    legend
      input(type="checkbox" v-model="strokePresent")
      = " Stroke? "
      i.fa.fa-pencil-square-o

    .grid-x.grid-margin-x(v-if="strokePresent")
      .shrink.cell
        label
          strong Color:
      .auto.cell
        input(type="color" v-model="strokeColor")

      .shrink.cell
        label
          strong Width:
      .auto.cell
        input(type="number" v-model.number="strokeWidth")

  fieldset.fieldset
    legend
      input(type="checkbox" v-model="fillPresent")
      = " Fill? "
      i.fa.fa-pencil-square

    .grid-x.grid-margin-x(v-if="fillPresent")
      .shrink.cell
        label
          strong Color:
      .auto.cell
        input(type="color" v-model="fillColor")
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: ["layer"],

    computed: {
      strokePresent: {
        get() {
          return this.layer.strokePresent
        },

        set(strokePresent) {
          this.updateLayer({ layer: this.layer, keyValueObject: { strokePresent }})
        }
      },

      strokeWidth: {
        get() {
          return this.layer.strokeWidth
        },

        set(newWidth) {
          this.setLayerStrokeWidth({ layer: this.layer, strokeWidth: newWidth })
        }
      },

      strokeColor: {
        get() {
          return this.layer.strokeColor
        },

        set(newColor) {
          this.setLayerStrokeColor({ layer: this.layer, strokeColor: newColor })
        }
      },

      fillPresent: {
        get() {
          return this.layer.fillPresent
        },

        set(fillPresent) {
          this.updateLayer({ layer: this.layer, keyValueObject: { fillPresent }})
        }
      },

      fillColor: {
        get() {
          return this.layer.fillColor
        },

        set(newColor) {
          this.setLayerFillColor({ layer: this.layer, fillColor: newColor })
        }
      },
    },

    methods: mapActions(["setLayerStrokeWidth", "setLayerStrokeColor", "setLayerFillColor", "updateLayer"])
  }
</script>
