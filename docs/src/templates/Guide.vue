<template lang="pug">
layout
  div(v-html="$page.guide.content")
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
  }
}
</script>
