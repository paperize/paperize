<template lang="pug">
div
  h4 Editing: {{ component.title || "[component title not set]" }}
  hr

  .grid-x.grid-margin-x
    .small-4.cell
      source-manager(:component="component")

    .small-4.cell
      transform-manager(:component="component")

    .small-4.cell
      template-manager(:component="component")
</template>

<script>
  import SourceManager from '../source/SourceManager.vue'
  import TemplateManager from '../template/TemplateManager.vue'
  import TransformManager from '../transform/TransformManager.vue'

  export default {
    props: ["component"],

    components: {
      'source-manager': SourceManager,
      'template-manager': TemplateManager,
      'transform-manager': TransformManager
    }
  }
</script>

<style>
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
