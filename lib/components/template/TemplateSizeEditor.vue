<template lang="pug">
fieldset.fieldset
  legend
    strong Component Size

  v-btn-toggle(v-model="paperMode" @change="paperModeChanged")
    v-btn(text value="standard") Standard
    v-btn(text value="custom") Custom

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
  import { isString, find } from 'lodash'
  import { mapActions } from 'vuex'

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
    props: {
      template: {
        type: Object,
        required: true
      }
    },

    data() {
      const size = this.template.size || {} // make sure we have defaults

      return {
        componentOptions,
        orientationOptions,
        paperMode: size.paperMode || "standard",
        paperFormat: size.paperFormat || "poker",
        paperOrientation: size.paperOrientation || "landscape",
      }
    },

    computed: {
      templateWidth: {
        get() { return this.template.size.w },
        set(newWidth) {
          if(isString(newWidth) || newWidth < 0) { newWidth = 0 }
          const newSize = { ...this.template.size, w: newWidth  }
          this.patchTemplate({ ...this.template, size: newSize })
        }
      },

      templateHeight: {
        get() { return this.template.size.h },
        set(newHeight) {
          if(isString(newHeight) || newHeight < 0) { newHeight = 0 }
          const newSize = { ...this.template.size, h: newHeight }
          this.patchTemplate({ ...this.template, size: newSize })
        }
      }
    },

    methods: {
      ...mapActions(["patchTemplate"]),

      paperModeChanged() {
        if(this.paperMode == "standard") {
          this.paperFormat = "poker"
          this.paperOrientation = "portrait"
          this.updatePageDimensions()
        } else {
          const size = {
            h: this.template.size.h,
            w: this.template.size.w,
            paperMode: this.paperMode
          }
          this.patchTemplate({ ...this.template, size })
        }
      },

      updatePageDimensions() {
        if(this.paperFormat.length == 0) { return }

        const
          format = find(componentOptions, { value: this.paperFormat }),
          width = format.width,
          height = format.height,
          smallerDimension = Math.min(width, height),
          largerDimension = Math.max(width, height)

        let size = {
          paperFormat: this.paperFormat,
          paperMode: this.paperMode,
          paperOrientation: this.paperOrientation
        }

        if(this.paperOrientation == 'portrait') {
          size = {...size,
            w: smallerDimension,
            h: largerDimension
          }
        } else if(this.paperOrientation == 'landscape') {
          size = {...size,
            w: largerDimension,
            h: smallerDimension,
          }
        }

        this.patchTemplate({ ...this.template, size })
      }
    }
  }
</script>
