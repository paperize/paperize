<template lang="pug">
#template-manager
  .grid-x
    .small-1.cell
      a.unset-source(@click="unsetSource({ component })") &times;

    .small-11.cell
      h5.truncate "Raw Source Viewer"

    .small-10.small-offset-1(v-if="component.source")
      ul.menu.horizontal
        li
          a(@click="previousItem") &lt;&lt;
        li
          | Item {{ currentItemIndex }} / {{ totalItems }}
        li
          a(@click="nextItem") &gt;&gt;

      .card
        //- .card-section(v-for="property in currentItem")
        //-   strong {{ property.key }}:
        //-   |  {{ property.value }}

        iframe(:src="pdfBlob")

      ul.menu.horizontal
        li
          a(@click="previousItem") &lt;&lt;
        li
          | Item {{ currentItemIndex }} / {{ totalItems }}
        li
          a(@click="nextItem") &gt;&gt;

    p(v-else) Select a Source...
</template>

<script>
  import _ from 'lodash'
  import pdfRenderer from './template_examples'

  export default {
    props: ["component"],

    data() {
      return {
        currentItemIndex: 1,
        pdfBlob: null
      }
    },

    watch: {
      currentItem() {
        this.calculatePDFBlob()
      }
    },

    computed: {
      items() {
        if(!this.source) { return [] }
        let propertyNames = this.source.data.values[0]
        return _(this.source.data.values).slice(1).map((row) => {
          let properties = []
          for(let i = 0; i < row.length; i++) {
            properties.push({ key: propertyNames[i], value: row[i] })
          }

          return properties
        }).value()
      },

      totalItems() {
        return this.items.length
      },

      currentItem() {
        return this.items[this.currentItemIndex - 1]
      },

      source() {
        return this.component.source
      }
    },

    methods: {
      previousItem() {
        this.currentItemIndex = Math.max(this.currentItemIndex - 1, 1)
      },

      nextItem() {
        this.currentItemIndex = Math.min(this.currentItemIndex + 1, this.totalItems)
      },

      calculatePDFBlob() {
        let game = this.$store.getters.activeGame
        let component = this.$store.getters.activeComponent
        let item = this.currentItem

        pdfRenderer.renderItemToPdf(game, component, item).then((pdfData) => {
          this.pdfBlob = pdfData
        })
      }
    }
  }
</script>
