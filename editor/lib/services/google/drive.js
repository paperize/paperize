import Promise from 'bluebird'
import { map } from 'lodash'
import { getClient } from './auth'

const
  findFolders = function(folderName) {
    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.drive.files.list({
          // Query for by the given name
          q: `mimeType = 'application/vnd.google-apps.folder' and name = '${ folderName }'`,
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

  createFolder = function(folderName) {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    }

    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.drive.files.create({
          resource: fileMetadata,
        }).then(
          (successResponse) => {
            if(successResponse.status == 200) {
              resolve(successResponse.result.id)
            } else {
              reject(new Error(successResponse.statusText))
            }
          },

          (failure) => { reject(failure) }
        )
      })
    })
  },

  findFile = function(filename, mimeType, foldersToSearch) {
    const nameClause = `name = '${filename}'`,
      mimeTypeClause = `mimeType = '${mimeType}'`

    let foundDatabaseId = null

    // Search each folder for the database filename
    return Promise.each(foldersToSearch, (folderId) => {
      // Early out once one is found
      if(foundDatabaseId) { return }
      // Build the search query
      const folderClause = `'${folderId}' in parents`

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
      }).then((databaseId) => {
        foundDatabaseId = databaseId
      })

    }).then(() => {
      return foundDatabaseId
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

export default { findFolders, createFolder, findFile, downloadFile, createFile, updateFile }
