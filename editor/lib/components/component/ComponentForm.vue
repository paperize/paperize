<template lang="pug">
modal.component-form(:name="modalName" height="auto" :pivotY="0.25" :scrollable="true")
  form(method="post" v-on:submit.prevent="submitForm")
    .grid-x.grid-padding-x
      .small-12.cell
        h1 {{ titleLabel }}
        hr

      .small-4.cell
        label(:for="`component-title-${component.id}`") Title:
      .small-8.cell
        input.component-title-new(type="text" :id="`component-title-${component.id}`" name="title" v-model="componentClone.title")

      .small-4.cell
        label(:for="`component-type-${component.id}`") Type:
      .small-8.cell
        select.component-type-new(:id="`component-type-${component.id}`" name="type" v-model="componentClone.type")
          option(value="deck") Deck of Cards
          option(value="tile-stack") Stack of Tiles
          option(value="booklet") Booklet or Manual
          option(value="custom") Custom Component

      .small-4.cell
        button.small.button.alert(type="button" @click="closeModal") Cancel
      .small-8.cell
        button.small.button.success(type="submit") {{ submitLabel }}


  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import Component from '../../models/component'

  export default {
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
        componentClone: { ...this.component },
        submitLabel: this.mode === 'edit' ? 'Edit Component' : 'Create Component',
        titleLabel: this.mode === 'edit' ? `Edit ${this.component.title}` : 'Add a Component'
      }
    },

    computed: {
      modalName() {
        if(this.mode == 'create') {
          return "create-component-modal"
        } else if(this.mode == 'edit') {
          return `edit-component-modal-${this.component.id}`
        }
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

      closeModal() {
        this.$modal.hide(this.modalName)
      }
    }
  }
</script>
