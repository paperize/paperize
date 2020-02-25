import { compact, difference, flatten, includes, map,
  pick, take, times } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const
  NESTING_DEPTH = 4,
  NESTING_DEPTH_ROOT = 6,
  MAX_FOLDERS_AUTO_INDEX = 50,
  DELAY_BETWEEN_INDEXES = 250

const FolderModel = {
  name: 'folders',

  relationships: [
    { relation: 'referencedBy', model: 'game', dependent: "nullify" },
  ],

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

    spreadsheetToNode: () => ({ id, name, refreshedAt }) => {
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
          getters.searchModelForParents("Spreadsheets", folderId),
          getters.spreadsheetToNode),

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
  },

  actions: {
    touchFolders({ dispatch }, folderIds) {
      return Promise.map(folderIds, (folderId) => {
        dispatch("patchFolder", { id: folderId, refreshedAt: Date.now() })
      })
    },

    ensureWorkingFolder({ getters, rootGetters, dispatch }) {
      if(!getters.workingFolder) {
        return dispatch("createFolder", {
          ...rootGetters.workingDirectory,
          parents: []
        })
      }
    },

    refreshRootFolderIndex({ dispatch, rootGetters }) {
      const { workingDirectoryId, allFolders, allSpreadsheets, allImages } = rootGetters

      // Insert the working folder manually
      return dispatch("ensureWorkingFolder").then(() => {
        return dispatch("refreshFolderIndex", { folderId: workingDirectoryId, NESTING_DEPTH_ROOT })

          // Now we need to purge any files and folders
          // in our index that aren't in Drive
          .then(({ folderIds, spreadsheetIds, imageIds }) => {
            const
              // recall all the ids we have stored in our index
              allFolderIds = map(allFolders, "id"),
              allSheetIds = map(allSpreadsheets, "id"),
              allImageIds = map(allImages, "id"),

              // remove Drive assets from indexed assets to get stale assets
              staleFolderIds = compact(difference(allFolderIds, folderIds)),
              staleSheetIds = compact(difference(allSheetIds, spreadsheetIds)),
              staleImageIds = compact(difference(allImageIds, imageIds))

            return Promise.all([
              // delete stale folders
              Promise.map(staleFolderIds, (folderId) => {
                return dispatch("destroyFolder", { id: folderId })
              }),

              // delete stale spreadsheets
              Promise.map(staleSheetIds, (sheetId) => {
                return dispatch("destroySpreadsheet", { id: sheetId })
              }),

              // delete stale images
              Promise.map(staleImageIds, (imageId) => {
                return dispatch("destroyImage", { id: imageId })
              })
            ])

            // TODO: clear these entries from caches (necessary?)
          })
      })
    },

    refreshFolderIndex({ dispatch }, { folderId, nesting = NESTING_DEPTH }) {
      let
        // prefetch the first item but treat it as if it's a collection of items
        currentPromise = dispatch("googleBatchGetTrackedFileIndex", [folderId]),
        trackedFolderIds = [folderId],
        trackedSheetIds = [],
        trackedImageIds = []

      // manage nesting depth
      times(nesting, (depth) => {
        currentPromise = currentPromise
          .delay(DELAY_BETWEEN_INDEXES) // Delay between requests keeps Google happy
          .then((indexes) => {
            if(!indexes) {
              return Promise.resolve()
            }

            // Flatten multiple promise results to single collections
            const
              folders = indexes.folders || [],
              sheets = indexes.sheets || [],
              images = indexes.images || [],
              goDeeper = depth < nesting - 1 // Calculate this now to be checked later

            // Accumulate tracked asset ids
            trackedFolderIds.push(map(folders, "id"))
            trackedSheetIds.push(map(sheets, "id"))
            trackedImageIds.push(map(images, "id"))

            // stuff each into appropriate store modules
            return Promise.all([
              Promise.all(map(folders, (folder) => dispatch("createFolder", folder))),
              Promise.all(map(sheets, (sheet) => dispatch("createSpreadsheet", sheet))),
              Promise.all(map(images, (image) => dispatch("createImage", image)))
            ]).then(() => {
              // Entering the next depth level...
              if(goDeeper && folders.length > 0) {
                // yell if we're truncating folders
                if(folders.length > MAX_FOLDERS_AUTO_INDEX) {
                  console.warn("Found more folders than we can index:", folders.length, "Limit:", MAX_FOLDERS_AUTO_INDEX)
                }
                // run a batch index for child folders
                const folderIds = map(take(folders, MAX_FOLDERS_AUTO_INDEX), "id")
                return dispatch("googleBatchGetTrackedFileIndex", folderIds)
              }
            })
          })
      })

      return currentPromise.then(() => {
        // resolve all the ids we fetched from Drive
        return {
          folderIds: flatten(trackedFolderIds),
          spreadsheetIds: flatten(trackedSheetIds),
          imageIds: flatten(trackedImageIds),
        }
      })
    }
  }
}

const FoldersModule = generateCrud(FolderModel)

export default FoldersModule
