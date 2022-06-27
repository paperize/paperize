import { createVuePlugin } from 'vite-plugin-vue2'

export default {
  server: { port: 8080 }, // whatever you set in your google dev console
  preview: {
    port: 8080,
    open: true
  },
  build: {
    sourcemap: true
  },
  plugins: [
    createVuePlugin()
  ],
}
