<template lang="pug">
v-layout(column)
  v-flex
    .subheading Text Look &amp; Feel

  v-flex
    v-text-field(v-model="textColor" type="color" label="Text Color")
  v-flex
    v-text-field(v-model="textSize" type="number" min="1" max="128" label="Text Size")

  v-flex
    .subheading Text Content

  v-flex
    p(v-pre) Use curly brackets to reference columns, like: {{Name}}

  v-flex
    v-textarea.text-content(v-model="textContentTemplate" label="Text Template")
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
      updateLayer: debounce(function(layer) {
        this.$store.dispatch("updateLayer", layer)
      }, 650, { leading: true }),
    }
  }
</script>

<style scoped>
  textarea {
    height: 200px;
  }
</style>
