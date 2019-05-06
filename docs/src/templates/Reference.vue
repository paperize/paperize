<template lang="pug">
layout
  div(v-html="$page.reference.content")

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
