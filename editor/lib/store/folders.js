import { each, every, flatten, includes, map, pick, take, times, without } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const MAX_FOLDERS_AUTO_INDEX = 10,
  DELAY_BETWEEN_INDEXES = 1500,
  INDEX_CONCURRENCY = 3

const FolderModel = {
  name: 'folders',

  create(newFolder) {
    return pick(newFolder, [
      "id",
      "name",
      "parents"
    ])
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

    folderToNode: (_, getters) => ({ id, name, refreshedAt }) => {
      return {
        id, name, refreshedAt,
        type: 'folder',
        children: getters.lookupChildrenOfNode(id)
      }
    },

    sheetToNode: () => ({ id, name, refreshedAt }) => {
      return {
        id, name, refreshedAt,
        type: 'sheet'
      }
    },

    imageToNode: () => ({ id, name, refreshedAt, md5 }) => {
      return { id, name, refreshedAt, md5, type: 'image' }
    },

    lookupChildrenOfNode: (_, getters) => (folderId) => {
      // A search and a transformation for each child type
      return flatten([
        map(
          getters.searchModelForParents("Folders", folderId),
          getters.folderToNode),

        map(
          getters.searchModelForParents("Sheets", folderId),
          getters.sheetToNode),

        map(
          getters.searchModelForParents("Images", folderId),
          getters.imageToNode)
      ])
    },

    lookupNode: (_, getters) => (folderId) => {
      const folder = getters.findFolder(folderId)

      return getters.folderToNode(folder)
    },

    completeIndexAsTree(_, getters) {
      const rootFolder = getters.workingFolder

      if(rootFolder) {
        const rootNode = getters.lookupNode(rootFolder.id)
        return [rootNode]

      } else {
        return []
      }
    },

    orphanedFolders(_, getters, __, rootGetters) {
      const orphanedFolders = rootGetters.searchFolders((folder) => {
        // every parent not found
        return every(map(folder.parents, (parent) => {
          // this parent not found
          return !rootGetters.findFolder(parent, false)
        }))
      })

      return without(orphanedFolders, getters.workingFolder)
    },

    orphanedSheets(_, __, ___, rootGetters) {
      return rootGetters.searchSheets((sheet) => {
        // every parent not found
        return every(map(sheet.parents, (parent) => {
          // this parent not found
          return !rootGetters.findFolder(parent, false)
        }))
      })
    },

    orphanedImages(_, __, ___, rootGetters) {
      return rootGetters.searchImages((image) => {
        // every parent not found
        return every(map(image.parents, (parent) => {
          // this parent not found
          return !rootGetters.findFolder(parent, false)
        }))
      })
    },

    orphanedItemsAsTree(_, getters) {
      return flatten([
        map(getters.orphanedFolders, getters.folderToNode),
        map(getters.orphanedSheets, getters.sheetToNode),
        map(getters.orphanedImages, getters.imageToNode),
      ])
    }
  },

  actions: {
    ensureWorkingFolder({ getters, rootGetters, dispatch }) {
      if(!getters.workingFolder) {
        return dispatch("createFolder", {
          ...rootGetters.workingDirectory,
          parents: []
        })
      }
    },

    refreshRootFolderIndex({ dispatch, rootGetters }) {
      // Nesting: 1 (for root folder) + X (folders deep)
      const nesting = 3,
        // get working directory id
        workingDirectoryId = rootGetters.workingDirectoryId

      // Insert the working folder manually
      return dispatch("ensureWorkingFolder").then(() => {
        return dispatch("refreshFolderIndex", { folderId: workingDirectoryId, nesting })
      })
    },

    refreshFolderIndex({ dispatch }, { folderId, nesting = 1 }) {
      // prefetch the first item but treat it as if it's a collection of items
      let currentPromise = Promise.all([dispatch("googleGetTrackedFileIndex", folderId)])
        .tap(() => { // Set refresh timestamp only AFTER the index comes in.
          return dispatch("patchFolder", { id: folderId, refreshedAt: Date.now() })
        })

      // manage nesting depth
      times(nesting, (depth) => {
        currentPromise = currentPromise.then((indexes) => {
          // Flatten multiple promise results to single collections
          const folders = flatten(map(indexes, "folders")),
            sheets = flatten(map(indexes, "sheets")),
            images = flatten(map(indexes, "images")),
            goDeeper = depth < nesting - 1 // Calculate this now to be checked later

          // stuff each into appropriate store modules
          return Promise.all([
            Promise.all(each(folders, (folder) => dispatch("createFolder", folder))),
            Promise.all(each(sheets, (sheet) => dispatch("createSheet", sheet))),
            Promise.all(each(images, (image) => dispatch("createImage", image)))
          ]).then(() => {
            // Entering the next depth level...
            if(goDeeper) {
              // gradually run tracked indexes on each of the child folders
              return Promise.map(take(folders, MAX_FOLDERS_AUTO_INDEX), (folder) => {
                return dispatch("googleGetTrackedFileIndex", folder.id)
                  .delay(DELAY_BETWEEN_INDEXES) // Delay between requests keeps Google happy

                  .tap(() => { // Set refresh timestamp only AFTER the index comes in.
                    return dispatch("patchFolder", { id: folder.id, refreshedAt: Date.now() })
                  })
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
