<template lang="pug">
fieldset.fieldset
  legend
    strong Component Size

  .grid-x.grid-padding-x
    .small-12.cell
      ul.menu
        li.menu-text Using:
        li(:class="{ 'is-active': paperMode == 'standard' }")
          a(@click="setPaperMode('standard')") Standard Sizes
        li(:class="{ 'is-active': paperMode == 'custom' }")
          a(@click="setPaperMode('custom')") Custom Size

      hr

    //- Standard Sizes
    template(v-if="paperMode == 'standard'")
      .small-12.cell
        p Select from some common component sizes.

      .small-12.cell
        .input-group
          span.input-group-label(title="inches") Size
          select.input-group-field(id="paper-format" @change="updatePageDimensions" v-model="paperFormat")
            option()
            option(v-for="componentOption in standardComponentOptions" :value="componentOption.value") {{ componentOption.name }}

      .small-12.cell
        .input-group
          span.input-group-label(title="inches") Orientation
          select.input-group-field(id="paper-orientation" @change="updatePageDimensions" v-model="paperOrientation")
            option(value="portrait") Portrait
            option(value="landscape") Landscape

    //- Custom Size
    template(v-else)
      .small-12.cell
        p Set your own custom component size in inches.

      .small-12.cell
        .input-group
          span.input-group-label(title="inches") Width
          input.input-group-field(id="paper-width" type="number" step="0.01" min="0" v-model.number="templateWidth")
          span.input-group-label(title="inches") in.

      .small-12.cell
        .input-group
          span.input-group-label Height
          input.input-group-field(id="paper-height" type="number" step="0.01" min="0" v-model.number="templateHeight")
          span.input-group-label(title="inches") in.
</template>

<script>
  import { debounce, isString, find } from 'lodash'
  import { mapMutations } from 'vuex'

  const standardComponentOptions = [
    { value: 'poker', name: 'Poker-sized Cards',
      width: 2.5, height: 3.5 },
    { value: 'a4', name: 'Whole Page (A4)',
      width: 8.3, height: 11.7 },
    { value: 'letter', name: 'Whole Page (Letter)',
      width: 8.5, height: 11 },
    { value: 'universal', name: 'Whole Page (Universal)',
      width: 8.3, height: 11 },
  ]

  export default {
    props: ["template"],

    data() {
      return {
        standardComponentOptions,
        paperMode: 'standard',
        paperFormat: '',
        paperOrientation: 'portrait',
      }
    },

    computed: {
      templateWidth: {
        get() { return this.template.size.w },
        set(newWidth) {
          if(isString(newWidth) || newWidth < 0) { newWidth = 0 }
          const newSize = { ...this.template.size, w: newWidth  }
          this.updateTemplate({ ...this.template, size: newSize })
        }
      },

      templateHeight: {
        get() { return this.template.size.h },
        set(newHeight) {
          if(isString(newHeight) || newHeight < 0) { newHeight = 0 }
          const newSize = { ...this.template.size, h: newHeight }
          this.updateTemplate({ ...this.template, size: newSize })
        }
      }
    },

    methods: {
      updateTemplate: debounce(function(payload) {
        this.$store.commit("updateTemplate", payload)
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

        let format = find(standardComponentOptions, { value: this.paperFormat })
          , width = format.width
          , height = format.height
          , smallerDimension = Math.min(width, height)
          , largerDimension = Math.max(width, height)

        if(this.paperOrientation == 'portrait') {
          this.updateTemplate({
            ...this.template,
            size: {
              w: smallerDimension,
              h: largerDimension
            }
          })

        } else if(this.paperOrientation == 'landscape') {
          this.updateTemplate({
            ...this.template,
            size: {
              w: largerDimension,
              h: smallerDimension
            }
          })
        }
      }
    }
  }
</script>
