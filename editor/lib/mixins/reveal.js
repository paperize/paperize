export default {
  // The way Foundation's Reveal works, it moves the dom element up to be a
  // direct child of <body>, removing Vue's ability to remove it cleanly upon
  // destroy. Add a little extra love here to see that the job is really done!
  destroyed() {
    try { // try to close the modal before removing the element
      $(this.$el).foundation('close')
    } catch(error) {
      if(error instanceof ReferenceError && error.message.includes('close')) {
        // Eat expected foundation no method "close" error
      } else {
        throw error
      }
    }

    $(this.$el).remove()
  },

  // Add a method for closing the modal
  methods: {
    closeModal() {
      $(this.$el).foundation('close')
    }
  }
}
