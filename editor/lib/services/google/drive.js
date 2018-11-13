import Promise from 'bluebird'
import { map } from 'lodash'
import { getClient } from './auth'

const PAPERIZE_DATABASE_FILENAME = "paperize_database.json"

// Resolves an array of ids
const getPaperizeFolderIds = function() {
  return new Promise((resolve, reject) => {
    getClient((client) => {
      client.drive.files.list({
        // Query for Folders named Paperize.io
        q: "mimeType = 'application/vnd.google-apps.folder' and name = 'Paperize.io'",
      }).then(
        // Success callback
        (folderResponse) => {
          const driveResult = folderResponse.result,
            folderIds = map(driveResult.files, (file) => file.id)

          resolve(folderIds)
        },
        // Failure callback
        (driveError) => {
          reject(driveError)
        })
    })
  })
}

// Resolves the found database id or undefined
const searchFolderForDatabase = function(folderId) {
  // Build the search query
  const folderClause = `'${folderId}' in parents`,
    nameClause       = `name = '${PAPERIZE_DATABASE_FILENAME}'`,
    mimeTypeClause   = "mimeType = 'application/json'"

  return new Promise((resolve, reject) => {
    getClient((client) => {
      client.drive.files.list({
        q: `${folderClause} and ${mimeTypeClause} and ${nameClause}`
      }).then(
        // Success callback
        ({ result }) => {
          if(result.files[0]) {
            resolve(result.files[0].id)
          } else {
            resolve()
          }
        },

        // Error callback
        (driveError) => {
          reject(driveError)
        })
    })
  })
}

export default {
  // Find a file named "paperize_database.json" in a folder named "Paperize.io"
  databaseLookup() {
    console.log("drive.databaseLookup() called")
    // query for possible db files
    return getPaperizeFolderIds().then((folderIds) => {
      console.log("found folderids", folderIds)
      let foundDatabaseId = null
      // Search each folder for the database filename
      return Promise.each(folderIds, (folderId) => {
        if(foundDatabaseId) { return }
        return searchFolderForDatabase(folderId).then((databaseId) => {
          console.log("found fileid", databaseId)
          foundDatabaseId = databaseId
        })

      }).then(() => {
        console.log(foundDatabaseId)
        return foundDatabaseId
      })
    })
  }
}
