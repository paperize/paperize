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
  import Promise from 'bluebird'
  import jsPDF from 'jspdf'
  import persistence from '../../store/pouch_persistence'

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
        return new Promise((resolve, reject) => {
          let doc = new jsPDF({ unit: 'in' })
          doc.deletePage(1)
          doc.addPage(2.5, 3.5)

          let left = .20, top = 0
          Promise.each(this.currentItem, (property) => {
            top += .20
            if(property.key == "Image") {
              // return this.toDataURL(property.value)
              return this.fetchDataByName(property.value)

              .then((imageDataURI) => {
                return new Promise((resolve, reject) => {
                  let image = new Image()
                  image.onload = function() {
                    doc.addImage(image, 'PNG', left, top, 2, 2)
                    resolve()
                  }
                  image.src = imageDataURI
                })
              })
            } else {
              doc.setFontSize(10)
              doc.text(`${property.key}: ${property.value}`, left, top)
            }
          }).then(() => {
            this.pdfBlob = doc.output('bloburi')
          })
        })
      },

      fetchDataByName(name) {
        let id = _.find(this.$store.state.assets.images, { name }).id
        if(id) {
          return persistence.db.get(id).then((asset) => asset.data)
        }
      },

      toDataURL(url) {
        return fetch(url)

        .then((response)=> {
          return response.blob()
        })

        .then(blob=> {
          return URL.createObjectURL(blob)
        })
      }
    }
  }
</script>
