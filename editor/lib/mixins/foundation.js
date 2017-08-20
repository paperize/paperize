// This is where we enable and disable foundation as component are rendered and removed.
export default {
  mounted() {
    $(this.$el).foundation()
  },

  // For destroy, we defend against double-destroy errors from foundation. This
  // is a cheap hack today, we can probably do much better if it turns out we
  // need to.
  destroyed() {
    try {
      $(this.$el).foundation("destroy")
    } catch(error) {
      if(error instanceof ReferenceError && error.message.includes('destroy')) {
        // Eat expected foundation double-destroy error
      } else {
        throw error
      }
    }
  },
}
