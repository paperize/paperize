import { each, flatten, includes, map, pick, take, times } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const MAX_FOLDERS_AUTO_INDEX = 10,
  DELAY_BETWEEN_INDEXES = 1500,
  INDEX_CONCURRENCY = 3

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
        type: 'folder',
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

      // Insert the working folder manually
      let currentPromise = dispatch("createFolder", { ...workingDirectory, parents: [] })
        .then(() => {
          // Get the tracked index of the root directory
          return Promise.all([dispatch("googleGetTrackedFileIndex", workingDirectory.id)])
        })

      // manage nesting depth
      times(nesting, (depth) => {
        currentPromise = currentPromise.then((indexes) => {
          // Flatten multiple promise results to single collections
          const folders = flatten(map(indexes, "folders")),
            sheets = flatten(map(indexes, "sheets")),
            images = flatten(map(indexes, "images")),
            keepGoing = depth < nesting-1 // Calculate this now to be checked later

          // stuff each into appropriate store modules
          return Promise.all([
            Promise.all(each(folders, (folder) => dispatch("createFolder", folder))),
            Promise.all(each(sheets, (sheet) => dispatch("createSheet", sheet))),
            Promise.all(each(images, (image) => dispatch("createImage", image)))
          ]).then(() => {
            // Entering the next depth level...
            if(keepGoing) {
              // gradually run tracked indexes on each of the child folders
              return Promise.map(take(folders, MAX_FOLDERS_AUTO_INDEX), (folder) => {
                return dispatch("googleGetTrackedFileIndex", folder.id)
                  .delay(DELAY_BETWEEN_INDEXES) // Delay between requests keeps Google happy
              }, { concurrency: INDEX_CONCURRENCY }) // Fewer concurrent API calls keeps Google happy
            }
          })
        })
      })

      // TODO: purge (or flag?) orphaned files and folders
      return currentPromise
    }
  }
}

const FoldersModule = generateCrud(FolderModel)

export default FoldersModule
