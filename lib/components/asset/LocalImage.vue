<template lang="pug">
img(:src="imageSource")
</template>

<script>
  import assetStore from '../../services/asset_store'

  export default {
    props: ["imageId"],

    asyncComputed: {
      imageSource() {
        return assetStore.getImage(this.imageId).get("data")
      }
    }
  }
</script>
