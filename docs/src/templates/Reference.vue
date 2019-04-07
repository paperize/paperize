<template lang="pug">
layout
  div(v-html="$page.reference.content")
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
  }
}
</script>
