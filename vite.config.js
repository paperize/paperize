import vue from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import shell from 'shelljs'

// Lookup the git sha and status to embed in the page
let
  gitSha = shell.exec("git log --pretty=format:'%h' -n 1").stdout.toUpperCase(),
  gitChanges = shell.exec("git diff --stat").stdout.trim()

if(gitChanges.length == 0) {
  gitChanges = "Clean checkout of " + gitSha

} else {
  gitChanges = gitChanges.split("\n")
  gitChanges = gitChanges[gitChanges.length-1]

  var diffLines = gitChanges.split(", ")
  if(diffLines[1]){
    gitSha += "+" + parseInt(diffLines[1])
  }
  if(diffLines[2]){
    gitSha += "-" + parseInt(diffLines[2])
  }
}
// env vars prefixed with VITE_ are available in the app
process.env['VITE_GIT_SHA'] = gitSha


export default {
  server: {
    port: 8080 // port you set in your google dev console
  },
  preview: {
    port: 8080, // port you set in your google dev console
    open: true
  },
  build: {
    sourcemap: true
  },
  plugins: [
    vue(),
    Components({ resolvers: [VuetifyResolver()] })
  ],
}
