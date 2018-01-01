<template lang="pug">
.text-layer-fields
  fieldset.fieldset
    legend Text Look &amp; Feel

    .grid-x.grid-margin-x
      .auto.cell
        strong Font Color:
      .shrink.cell
        input(type="color" v-model="textColor")

    .grid-x.grid-margin-x
      .auto.cell
        strong Font Face:
      .shrink.cell
        em Coming soon...

      .auto.cell
        strong Font Size:
      .shrink.cell
        select(v-model="textSize")
          option(v-for="size in [5, 6, 7, 8, 9, 10, 12, 16, 20, 24, 32, 48, 64, 72]" :value="size") {{ size }}


  fieldset.fieldset
    legend Text Content

    //- .grid-x.grid-margin-x
    //-   .shrink.cell
    //-     strong From Source Property:
    //-     select(v-model="textProperty")
    //-       option(v-for="property in propertyNames" value="property") {{ property }}

    .grid-x.grid-margin-x
      .auto.cell
        strong From Template:
        textarea(v-model="textContentTemplate")
</template>

<script>
  import { debounce } from 'lodash'
  import { mapActions } from 'vuex'
  import { computedVModelUpdateAll } from '../../../store/component_helper'

  export default {
    props: ["layer", "source"],

    computed: {
      propertyNames() {
        return this.$store.getters.sourceProperties(this.source)
      },

      ...computedVModelUpdateAll("layer", "updateLayer", [
        // "textContentProperty",
        // "textContentProperty",
        "textContentTemplate",
        "textColor",
        "textSize",
        // "textFont",
      ])
    },

    methods: {
      updateLayer: debounce(function({ layer, keyValueObject }) {
        this.$store.dispatch("updateLayer", { layer, keyValueObject })
      }, 650, { leading: true }),
    }
  }
</script>
