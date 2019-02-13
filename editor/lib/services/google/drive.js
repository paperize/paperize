import { map } from 'lodash'
import { getClient } from './auth'
import { matchGoogleId } from './util'

const
  getFolder = function(folderIdInput) {
    return new Promise((resolve, reject) => {
      const folderId = matchGoogleId(folderIdInput)

      if(!folderId) {
        reject(new Error(`Invalid Google Drive resource: ${folderIdInput}`))
      } else {
        getClient((client) => {
          client.drive.files.get({
            fileId: folderId
          }).then(
            (folderResponse) => {
              const driveResult = folderResponse.result

              if(driveResult.mimeType !== "application/vnd.google-apps.folder") {
                reject(new Error("Not a folder!"))
              } else {
                resolve([driveResult.id, driveResult.name])
              }
            },
            reject
          )
        })
      }
    })
  },

  getRecord = function(fileId) {
    return new Promise((resolve, reject) => {
      fileId = matchGoogleId(fileId || "")

      if(!fileId) {
        reject(new Error("Invalid Google Id"))
      } else {
        getClient((client) => {
          client.drive.files.get({
            fileId,
            fields: "id,name,md5Checksum,mimeType"
          }).then(
            ({ result }) => {
              resolve({
                id:       result.id,
                name:     result.name,
                md5:      result.md5Checksum,
                mimeType: result.mimeType
              })
            },

            reject)
        })
      }
    })
  },

  getIndex = function(folderId, options={}) {
    // Build the query
    let queryParts = []
    queryParts.push(`'${folderId}' in parents`)
    queryParts.push(`trashed = false`)
    if(options.mimeType == 'IMAGE') {
      // Only looking for image files
      queryParts.push(`mimeType contains 'image/'`)
    }
    const query = queryParts.join(' and ')

    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.drive.files.list({
          q: query,
          fields: "files(id,name,md5Checksum,mimeType)"
        }).then(
          ({ result }) => {
            resolve(map(result.files, (file) => {
              return {
                id:       file.id,
                name:     file.name,
                md5:      file.md5Checksum,
                mimeType: file.mimeType
              }
            }))
          },

          reject)
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
            (driveError) => {
              reject(driveError)
            }
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
            (driveError) => {
              reject(driveError)
            })
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

          (driveError) => {
            reject(driveError)
          })
      })
    })
  },

  createFile = function(name, mimeType, folder, contents) {
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

            (failureResponse) => {
              reject(failureResponse)
            }
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
      parents: [parentId]
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

          (failure) => { reject(failure) }
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

          (failureResponse) => {
            reject(failureResponse)
          }
        )
      })
    })
  }

export default {
  getFolder,
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
