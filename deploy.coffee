# Basic Deploy: Upload everything in /dist straight to S3
_ = require("lodash")
mimeTypes = require("mime-types")
process.env.AWS_PROFILE = "paperize-editor-beta" # force to beta for now
AWS = require("aws-sdk")
Promise = require("bluebird")
s3 = new AWS.S3()
putObjectAsync = Promise.promisify(s3.putObject.bind(s3))
cloudfront = new AWS.CloudFront()
createInvalidationAsync = Promise.promisify(cloudfront.createInvalidation.bind(cloudfront))
fs = Promise.promisifyAll(require("fs"))
recursiveReaddir = require("recursive-readdir")

TARGET_BUCKET = 'beta.editor.paperize.io'
CLOUDFRONT_DISTRIBUTION_ID = "E32JZ9YALLPGSM"

# for each file in /dist
recursiveReaddir('./dist').then (files) ->
  itemCount = files.length
  # Strip the dist dir from the path
  files = files.map (file) -> file.replace("dist/", "")
  # Start uploading in parallel
  console.log("Uploading #{itemCount} files...")
  Promise.map files, uploadFileToS3, concurrency: 10

  .then ->
    console.log("Invalidating CloudFront cache...")
    createInvalidationAsync
      DistributionId: CLOUDFRONT_DISTRIBUTION_ID
      InvalidationBatch:
        CallerReference: String(Date.now())
        Paths:
          Quantity: 1
          Items: [ '/*' ]

  .then ->
    console.log("Done.")

uploadFileToS3 = (file) ->
  mimeType = mimeTypes.lookup(file) || 'application/octet-stream'

  putObjectAsync({
    Bucket: TARGET_BUCKET
    Key:    file
    Body:   fs.createReadStream("./dist/#{file}")
    ACL:    'public-read'
    ContentDisposition: 'inline'
    ContentType: mimeType

  }).then ->
    console.log "Uploaded #{file}, #{mimeType}"
