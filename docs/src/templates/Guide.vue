<template lang="pug">
layout
  div(v-html="$page.guide.content")

  div(v-if="noContent")
    p ...coming soon...
</template>

<page-query>
query Guide ($path: String!) {
  guide: guide (path: $path) {
    title
    content
  }
}
</page-query>

<script>
export default {
  metaInfo () {
    return {
      title: this.$page.guide.title
    }
  },

  computed: {
    noContent() {
      return this.$page.guide.content.length < 200
    }
  }
}
</script>
