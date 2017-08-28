<template lang="pug">
#template-manager
  h5 Template Manager
  hr

  div(v-if="component.source")
    p Item Previews:

    p(v-for="property in currentItem")
      strong {{ property.key }}:
      |  {{ property.value }}

    ul.menu.horizontal
      li
        a(@click="previousItem") &lt;&lt;
      li
        | Item {{ currentItemIndex }} / {{ totalItems }}
      li
        a(@click="nextItem") &gt;&gt;
</template>

<script>
  import _ from 'lodash'

  export default {
    props: ["component"],

    data() {
      return {
        currentItemIndex: 1
      }
    },

    computed: {
      items() {
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
      }
    }
  }
</script>
