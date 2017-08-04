<template lang="pug">
.reveal(data-reveal)
  h1 {{ mode === 'edit' ? `Edit ${component.title}` : 'Add a Component' }}
  hr

  form(method="post" v-on:submit.prevent="submitForm")
    .grid-x.grid-margin-x
      .small-4.cell
        label(for="component-title") Title:
      .small-8.cell
        input(type="text" id="component-title" name="title" v-model="componentClone.title")

      .small-4.cell
        label(for="component-type") Type:
      .small-8.cell
        select(id="component-type" name="type" v-model="componentClone.type")
          option(value="deck") Deck
          option(value="tile-stack") Stack of Tiles
          option(value="booklet") Booklet or Manual
          option(value="custom") Custom Component

    button.button.alert(type="button" @click="closeModal") Cancel
    button.button.success(type="submit") {{ mode === 'edit' ? 'Edit' : 'Create' }} Component


  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import FoundationMixin from '../mixins/foundation'
  import Component from '../models/component'

  export default {
    mixins: [FoundationMixin],

    destroyed() {
      $(this.$el).remove()
    },

    props: {
      mode: {
        default: 'edit',
        type: String,
        validator: (mode) => mode == 'edit' || mode == 'create'
      },

      component: {
        default: Component.factory
      }
    },

    data() {
      return {
        componentClone: { ...this.component }
      }
    },

    methods: {
      submitForm() {
        // Add or update the component in the store
        if(this.mode === 'edit') {
          this.$store.commit("updateComponent", { component: this.componentClone })
        } else if(this.mode === 'create') {
          this.$store.commit("createComponent", { component: this.componentClone })
        }
        // Close the modal
        this.closeModal()
        // Alert our parents we've submitted
        this.$emit("submitted")
        // Reset the model
        this.componentClone = { ...this.component }
      },

      closeModal () {
        $(this.$el).foundation('close')
      }
    }
  }
</script>
