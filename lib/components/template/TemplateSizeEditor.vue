<template lang="pug">
fieldset.fieldset
  legend
    strong Component Size

  v-btn-toggle(v-model="paperMode")
    v-btn(flat value="standard") Standard
    v-btn(flat value="custom") Custom

  v-divider

  //- Standard Sizes
  template(v-if="paperMode == 'standard'")
    p Select from some common component sizes.

    v-select.paper-format(label="Size" :items="componentOptions" item-text="name" item-value="value"  @change="updatePageDimensions" v-model="paperFormat")
    v-select.paper-orientation(label="Orientation" :items="orientationOptions" item-text="name" item-value="value"  @change="updatePageDimensions" v-model="paperOrientation")

  //- Custom Size
  template(v-else)
    p Set your own custom component size in inches.

    v-text-field.paper-width(label="Width" suffix="in." type="number" step="0.01" min="0" v-model.number="templateWidth")
    v-text-field.paper-height(label="Height" suffix="in." type="number" step="0.01" min="0" v-model.number="templateHeight")
</template>

<script>
  import { debounce, isString, find } from 'lodash'
  import { mapMutations } from 'vuex'

  const componentOptions = [
    { value: 'poker', name: 'Poker-sized Cards',
      width: 2.5, height: 3.5 },
    { value: 'a4', name: 'Whole Page (A4)',
      width: 8.3, height: 11.7 },
    { value: 'letter', name: 'Whole Page (Letter)',
      width: 8.5, height: 11 },
    { value: 'universal', name: 'Whole Page (Universal)',
      width: 8.3, height: 11 },
  ]

  const orientationOptions = [
    { name: "Portrait", value: 'portrait' },
    { name: "Landscape", value: 'landscape' }
  ]

  export default {
    props: ["template"],

    data() {
      return {
        componentOptions,
        orientationOptions,
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

        let format = find(componentOptions, { value: this.paperFormat })
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