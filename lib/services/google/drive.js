import { compact, filter, includes, map, reduce } from 'lodash'
import { getClient } from './auth'
import { matchGoogleId } from './util'

const
  doBatchRequest = function(requestsToBatch) {
    return new Promise((resolve) => {
      getClient((client) => {
        // Create a new batch and add each request to it
        const batch = reduce(requestsToBatch, (newBatch, request) => {
          newBatch.add(request)
          return newBatch
        }, client.newBatch())

        resolve(batch)
      })
    })
  },

  getRecord = function(fileId) {
    return new Promise((resolve, reject) => {
      fileId = matchGoogleId(fileId || "")

      if(!fileId) {
        reject(new Error(`Invalid Google ID: ${fileId}`))
      } else {
        getClient((client) => {
          client.drive.files.get({
            fileId,
            fields: "id,name,md5Checksum,mimeType,parents,trashed"
          }).then(
            ({ result: { id, name, mimeType, parents, md5Checksum, trashed } }) => {
              trashed ?
                reject(new Error(`File not found: ${fileId}.`)) :
                resolve({ id, name, mimeType, parents, md5: md5Checksum })
            },

            (response) => reject(new Error(response.body))
          )
        })
      }
    })
  },

  getIndex = function(folderIds, options={}) {
    // Build the query
    const
      andQueries = [],
      // in this folder or this folder or this folder...
      orSubQuery =
        map(folderIds,
          folderId => `'${folderId}' in parents`)
          .join(' or ')

    andQueries.push(`(${orSubQuery})`)

    // No trashed files
    andQueries.push(`trashed = false`)

    // Only a certain type of files
    let mimeType
    if(options.indexType == 'FOLDER') {
      // Folders
      mimeType = 'application/vnd.google-apps.folder'
    } else if(options.indexType == 'SHEET') {
      // Sheets
      mimeType = 'application/vnd.google-apps.spreadsheet'
    } else if(options.indexType == 'IMAGE') {
      // Image formats
      mimeType = 'image/'
    }

    if(mimeType) {
      andQueries.push(`mimeType contains '${mimeType}'`)
    }

    const query = andQueries.join(' and ')

    // Make the request
    return new Promise((resolve) => {
      getClient((client) => {
        const listPromse = client.drive.files.list({
          q: query,
          fields: "files(id,name,md5Checksum,mimeType,parents)",
          pageSize: 1000, // Maximum, so we don't have to paginate yet
        })

          .then(({ result: { files } }) => {
            // transform from Google response to Paperize data
            return map(files, (file) => {
              return {
                id:       file.id,
                name:     file.name,
                md5:      file.md5Checksum,
                mimeType: file.mimeType,
                parents:  file.parents
              }
            })
          })

          .then((files) => {
            return {
              // sort the returned files by type
              folders: filter(files, { mimeType: "application/vnd.google-apps.folder" }),
              sheets: filter(files, { mimeType: "application/vnd.google-apps.spreadsheet" }),
              images: filter(files, file => includes(file.mimeType, "image/") ),
            }
          })

        resolve(listPromse)
      })
    })
  },

  findFolders = function(folderName) {
    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.drive.files.list({
          // Query for by the given name
          q: `mimeType = 'application/vnd.google-apps.folder' and name = '${ folderName }' and trashed = false`,
        })

          .then(
            // Success callback
            (folderResponse) => {
              const driveResult = folderResponse.result,
                folderIds = map(driveResult.files, (file) => file.id)

              resolve(folderIds)
            },
            // Failure callback
            (response) => reject(new Error(response.body))
          )
      })
    })
  },

  createFolder = function(folderName, options={}) {
    return this.createDriveItem(folderName, options.parentId, 'application/vnd.google-apps.folder')
  },

  findFile = function(filename, mimeType, foldersToSearch) {
    const nameClause = `name = '${filename}'`,
      mimeTypeClause = `mimeType = '${mimeType}'`,
      trashedClause  = 'trashed = false'

    let foundDatabaseId = null,
      foundInParentId = null

    // Search each folder for the database filename
    return Promise.each(foldersToSearch, (folderId) => {
      // Early out once one is found
      if(foundDatabaseId) { return }
      // Build the search query
      const folderClause = `'${folderId}' in parents`

      return new Promise((resolve, reject) => {
        getClient((client) => {
          client.drive.files.list({
            q: `${folderClause} and ${mimeTypeClause} and ${nameClause} and ${trashedClause}`
          }).then(
            // Success callback
            ({ result }) => {
              // if at least one file was found
              if(result.files[0]) {
                // use the first one found
                foundDatabaseId = result.files[0].id
                foundInParentId = folderId
              }
              resolve()
            },

            // Error callback
            (response) => reject(new Error(response.body))
          )
        })
      })
    }).then(() => {
      return [foundDatabaseId, foundInParentId]
    })
  },

  downloadFile = function(fileId) {
    return new Promise((resolve, reject) => {
      // drive.files.get with alt=media to download a file directly
      getClient((client) => {
        client.drive.files.get({
          fileId,
          alt: 'media'
        }).then(
          (result) => {
            resolve(result.body)
          },

          (response) => reject(new Error(response.body))
        )
      })
    })
  },

  createFile = function(name, mimeType, folder, contents, options={}) {
    // Need to create a file in Drive and actually set its contents?
    // Seems we have to do this the hard way...
    // https://stackoverflow.com/questions/34905363/create-file-with-google-drive-api-v3-javascript
    const boundary = '-------314159265358979323846',
      delimiter    = `\r\n--${ boundary }\r\n`,
      close_delim  = `\r\n--${ boundary }--`,

      metadata = {
        name, mimeType,
        parents: [folder]
      },

      multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        (options.base64 ? "Content-Transfer-Encoding: base64\r\n" : "") +
        `Content-Type: ${ mimeType }\r\n\r\n` +
        contents +
        close_delim

    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.request({
          path: '/upload/drive/v3/files',
          method: 'POST',
          params: { 'uploadType': 'multipart' },
          headers: {
            'Content-Type': `multipart/related boundary="${ boundary }"`
          },
          body: multipartRequestBody
        })

          .then(
            (successResponse) => {
              if(successResponse.status == 200) {
                resolve(successResponse.result.id)
              } else {
                reject(new Error(successResponse.statusText))
              }
            },

            (response) => reject(new Error(response.body))
          )
      })
    })
  },

  createSpreadsheet = function(name, parentId) {
    return this.createDriveItem(name, parentId, 'application/vnd.google-apps.spreadsheet')
  },

  createDriveItem = function(name, parentId, mimeType) {
    const fileMetadata = {
      name, mimeType,
      parents: compact([parentId])
    }

    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.drive.files.create({
          resource: fileMetadata,
        }).then(
          ({ status, statusText, result}) => {
            if(status == 200) {
              resolve(result.id)
            } else {
              reject(new Error(statusText))
            }
          },

          (response) => reject(new Error(response.body))
        )
      })
    })
  },

  updateFile = function(fileId, contents) {
    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.request({
          path: `/upload/drive/v3/files/${fileId}`,
          method: 'PATCH',
          params: { 'uploadType': 'media' },
          headers: {},
          body: contents
        }).then(
          (successResponse) => {
            if(successResponse.status == 200) {
              resolve()
            } else {
              reject(new Error(successResponse.statusText))
            }
          },

          (response) => reject(new Error(response.body))
        )
      })
    })
  }

export default {
  doBatchRequest,
  getRecord,
  getIndex,
  findFolders,
  createFolder,
  findFile,
  downloadFile,
  createFile,
  createDriveItem,
  createSpreadsheet,
  updateFile
}
