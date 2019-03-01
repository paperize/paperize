import { each, flatten, includes, map, pick, take, times } from 'lodash'
import { generateCrud } from './util/vuex_resource'

// const MAX_FOLDERS_AUTO_INDEX = 2,
const MAX_FOLDERS_AUTO_INDEX = 10,
  DELAY_BETWEEN_INDEXES = 3000

const FolderModel = {
  name: 'folders',

  create(newFolder) {
    return {
      ...pick(newFolder, [
        "id",
        "name",
        "parents"
      ]),

      refreshedAt: Date.now()
    }
  },

  getters: {
    workingFolder(_, getters, __, rootGetters) {
      if(rootGetters.workingDirectoryId) {
        return getters.findFolder(rootGetters.workingDirectoryId, false)
      }
    },

    searchModelForParents: (_, __, ___, rootGetters) => (modelName, parentId) => {
      return rootGetters[`search${modelName}`]((model) => {
        return includes(model.parents, parentId)
      })
    },

    lookupChildrenOfNode: (_, getters) => (folderId) => {
      // A search and a transformation for each child type
      const
        folderNodes = map(
          getters.searchModelForParents("Folders", folderId),
          ({ id, name }) => {
            return { id, name, type: 'folder', children: getters.lookupChildrenOfNode(id) }
          }),

        sheetNodes = map(
          getters.searchModelForParents("Sheets", folderId),
          ({ id, name }) => {
            return { id, name, type: 'sheet'}
          }),

        imageNodes = map(
          getters.searchModelForParents("Images", folderId),
          ({ id, name, md5 }) => {
            return { id, name, md5, type: 'image' }
          })

      // Combine them into a single, flat array
      return flatten([folderNodes, sheetNodes, imageNodes])
    },

    lookupNode: (_, getters) => (folderId) => {
      const folder = getters.findFolder(folderId)

      let node = {
        id: folder.id,
        name: folder.name,
        children: getters.lookupChildrenOfNode(folder.id),
      }

      return node
    },

    completeIndexAsTree(_, getters) {
      const rootFolder = getters.workingFolder

      if(rootFolder) {
        const rootNode = getters.lookupNode(rootFolder.id)
        return [rootNode]

      } else {
        return []
      }
    }
  },

  actions: {
    refreshDriveIndex({ dispatch, rootGetters }) {
      // Nesting: 1 (for root folder) + X (folders deep)
      const nesting = 3,
        // get working directory id
        workingDirectory = rootGetters.workingDirectory

      // start by getting the tracked index of the root directory
      let currentPromise = Promise.all([dispatch("googleGetTrackedFileIndex", workingDirectory.id)])

      // Insert the working folder manually
      dispatch("createFolder", { ...workingDirectory, parents: [] })

      // manage nesting depth
      times(nesting, (depth) => {
        currentPromise = currentPromise.then((indexes) => {
          // Flatten multiple promise results to single collections
          const folders = flatten(map(indexes, "folders")),
            sheets = flatten(map(indexes, "sheets")),
            images = flatten(map(indexes, "images"))

          // stuff each into appropriate store modules
          each(folders, (folder) => { dispatch("createFolder", folder) })
          each(sheets, (sheet) => { dispatch("createSheet", sheet) })
          each(images, (image) => { dispatch("createImage", image) })

          if(depth < nesting-1) {
            // gradually run tracked indexes on each of the child folders
            return Promise.map(take(folders, MAX_FOLDERS_AUTO_INDEX), (folder) => {
              return dispatch("googleGetTrackedFileIndex", folder.id)
                .delay(DELAY_BETWEEN_INDEXES) // Delay between requests keeps Google happy
            }, { concurrency: 1 }) // One index at a time keeps Google happy
          }
        })
      })

      // TODO: purge (or flag?) orphaned files and folders
      return currentPromise
    }
  }
}

const FoldersModule = generateCrud(FolderModel)

export default FoldersModule
