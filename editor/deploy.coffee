_ = require("lodash")
# Basic Deploy: Upload everything in /build straight to S3

# Hardcode staging for the moment
process.env.AWS_PROFILE = "paperize-staging"
AWS = require("aws-sdk")

Promise = require("bluebird")
s3 = Promise.promisifyAll(new AWS.S3())
fs = Promise.promisifyAll(require("fs"))

# for each file in /build
fs.readdirAsync('./build').then (files) ->
  Promise.map files, uploadFileToS3, concurrency: 10

mimeTypes = require("mime-types")

uploadFileToS3 = (file) ->
  mimeType = mimeTypes.lookup(file) || 'application/octet-stream'

  s3.putObjectAsync({
    Bucket: 'staging.editor.paperize.io'
    Key:    file
    Body:   fs.createReadStream("./build/#{file}")
    ACL:    'public-read'
    ContentDisposition: 'inline'
    ContentType: mimeType

  }).then ->
    console.log "Uploaded #{file}, #{mimeType}"
