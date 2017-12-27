<template lang="pug">
  iframe(:src="pdfBlob")
</template>

<script>
  import pdfRenderer from './template_examples'

  export default {
    props: ["game", "component", "item"],

    asyncComputed: {
      pdfBlob() {
        return pdfRenderer.renderItemToPdf(this.game, this.component, this.item)
      }
    }
  }

</script>

<style scoped>
  iframe {
    min-height: 400px;
  }
</style>
