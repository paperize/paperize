<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline Component: {{ component.title }}

      v-tooltip(top)
        | Make a Copy of This Component
        v-btn(slot="activator" fab small v-on:click="copyComponent")
            v-icon mdi-content-copy

    v-card-text
      v-text-field.component-title(v-model="title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")
      template-size-editor(v-if="componentTemplate" :template="componentTemplate")

    v-card-actions
      v-btn(small success @click="submitComponent") Done
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { computedVModelUpdate } from '../util/component_helper'
  import TemplateSizeEditor from '../template/TemplateSizeEditor.vue'

  export default {
    props: {
      component: { required: true }
    },

    components: { TemplateSizeEditor },

    data() {
      return {
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      ...mapGetters(["activeGame", "findComponentTemplate"]),

      title: computedVModelUpdate("component", "patchComponent", "title"),

      componentTemplate() {
        return this.component && findComponentTemplate(this.component)
      }
    },

    methods: {
      ...mapActions(["patchComponent", "copyGameComponent"]),

      copyComponent() {
        const copyComponent = {
          ...this.component,
          title: `${this.component.title} Copy`
        }

        this.copyGameComponent({ game: this.activeGame, component: copyComponent })
        this.$emit("close-dialog")
      },

      submitComponent() {
        if(this.$refs.componentForm.validate()) {
          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
