<template lang="pug">
  figure
    v-img(:src="src")
    figcaption {{ caption }}
</template>

<script>
  export default {
    props: ["src", "caption"]
  }
</script>

<style scoped>
  figure {
    border: thin #c0c0c0 solid;
    display: flex;
    flex-flow: column;
    padding: 5px;
    max-width: 90%;
    margin: 1em auto;
  }

  figcaption {
    background-color: #222;
    color: #fff;
    font: italic smaller sans-serif;
    padding: 3px;
    text-align: center;
  }
</style>
