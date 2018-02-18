<template lang="pug">
modal.component-form(:name="modalName" height="auto" :pivotY="0.25" :scrollable="true")
  form(method="post" v-on:submit.prevent="closeModal")
    .grid-x.grid-padding-x
      .small-12.cell
        h2 Component: {{ component.title }}
        hr

      .small-12.cell
        .input-group
          span.input-group-label
            label(:for="`component-title-${component.id}`") Title
          input.input-group-field.component-title-new(type="text" :id="`component-title-${component.id}`" name="title" v-model="componentTitle")

      .small-12.cell
        template-size-editor(:template="findComponentTemplate(component)")

      .small-12.cell
        button.small.button(@click="closeModal") Close


  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import { mapGetters } from 'vuex'
  import Component from '../../models/component'
  import TemplateSizeEditor from '../template/TemplateSizeEditor.vue'

  export default {
    props: {
      component: {
        required: true
      }
    },

    components: {
      "template-size-editor": TemplateSizeEditor,
    },

    data() {
      return {
        modalName: `edit-component-modal-${this.component.id}`
      }
    },

    computed: {
      ...mapGetters(["activeGame", "findComponentTemplate"]),

      componentTitle: {
        get() { return this.component.title },

        set(newTitle) {
          this.$store.dispatch("updateComponent", { ...this.component, ...{ title: newTitle }})
        }
      }
    },

    methods: {
      closeModal() {
        this.$modal.hide(this.modalName)
      }
    }
  }
</script>
