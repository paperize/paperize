<template lang="pug">
.reveal.component-form(data-reveal)
  h1 {{ mode === 'edit' ? `Edit ${component.title}` : 'Add a Component' }}
  hr

  form(method="post" v-on:submit.prevent="submitForm")
    .grid-x.grid-margin-x
      .small-4.cell
        label(:for="`component-title-${component.id}`") Title:
      .small-8.cell
        input(type="text" :id="`component-title-${component.id}`" name="title" v-model="componentClone.title")

      .small-4.cell
        label(:for="`component-type-${component.id}`") Type:
      .small-8.cell
        select(:id="`component-type-${component.id}`" name="type" v-model="componentClone.type")
          option(value="deck") Deck of Cards
          option(value="tile-stack") Stack of Tiles
          option(value="booklet") Booklet or Manual
          option(value="custom") Custom Component

    button.small.button.alert(type="button" @click="closeModal") Cancel
    button.small.button.success(type="submit") {{ mode === 'edit' ? 'Edit' : 'Create' }} Component


  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import FoundationMixin from '../../mixins/foundation'
  import RevealMixin from '../../mixins/reveal'
  import Component from '../../models/component'

  export default {
    mixins: [ RevealMixin, FoundationMixin ],

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
          this.$store.dispatch("updateComponent", { component: this.componentClone })
        } else if(this.mode === 'create') {
          this.$store.dispatch("createComponent", { component: this.componentClone })
        }
        // Close the modal
        this.closeModal()
        // Alert our parents we've submitted
        this.$emit("submitted")
        // Reset the model
        this.componentClone = { ...this.component }
      },
    }
  }
</script>
