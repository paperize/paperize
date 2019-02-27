import { generateCrud } from './util/vuex_resource'

const FolderModel = {
  name: 'folders',

  actions: {
    refreshDriveIndex({ dispatch, rootGetters }) {
      // set nesting level to 3
      let nesting = 3,
        // get working directory id
        workingDirectoryId = rootGetters.workingDirectoryId
      // query 3 times: folders, sheets, images
      return dispatch("googleGetTrackedFileIndex", workingDirectoryId)
        .then(({folders, sheets, images}) => {
          // stuff each into appropriate store modules
          console.log(folders)
          console.log(sheets)
          console.log(images)
        })
      // reduce nesting level and repeat on each found folder
      // stop when nesting is 0
    }
  }
}

const FoldersModule = generateCrud(FolderModel)

export default FoldersModule
