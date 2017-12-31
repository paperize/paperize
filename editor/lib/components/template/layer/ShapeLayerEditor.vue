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
        get() { return this.layer.strokePresent },

        set(strokePresent) {
          this.updateLayer({ layer: this.layer, keyValueObject: { strokePresent }})
        }
      },

      strokeWidth: {
        get() { return this.layer.strokeWidth },

        set(strokeWidth) {
          this.updateLayer({ layer: this.layer, keyValueObject: { strokeWidth }})
        }
      },

      strokeColor: {
        get() { return this.layer.strokeColor },

        set(strokeColor) {
          this.updateLayer({ layer: this.layer, keyValueObject: { strokeColor }})
        }
      },

      fillPresent: {
        get() { return this.layer.fillPresent },

        set(fillPresent) {
          this.updateLayer({ layer: this.layer, keyValueObject: { fillPresent }})
        }
      },

      fillColor: {
        get() { return this.layer.fillColor },

        set(fillColor) {
          this.updateLayer({ layer: this.layer, keyValueObject: { fillColor }})
        }
      },
    },

    methods: mapActions(["updateLayer"])
  }
</script>
