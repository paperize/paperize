<template lang="pug">
layout
  VueRemarkContent

  div(v-if="noContent")
    p ...coming soon...
</template>

<page-query>
query Reference ($path: String!) {
  reference: reference (path: $path) {
    title
    content
  }
}
</page-query>

<script>
export default {
  metaInfo () {
    return {
      title: this.$page.reference.title
    }
  },

  computed: {
    noContent() {
      return this.$page.reference.content.length < 200
    }
  }
}
</script>
