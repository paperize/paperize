## Basic Deploy: Upload everything in /dist straight to S3

# Configuration Constants
AWS_PROFILE = "docs-deployer" # references ~/.aws/credentials
TARGET_BUCKET = 'docs.paperize.io' # S3 bucket name
CLOUDFRONT_DISTRIBUTION_ID = "E1G7A2XX5SSZTS"
DIRECTORY_TO_DEPLOY = "dist" # local directory containing static files

# Utils
_ = require("lodash")

# Setup AWS
process.env.AWS_PROFILE = AWS_PROFILE
AWS = require("aws-sdk")
s3 = new AWS.S3()
cloudfront = new AWS.CloudFront()

# Filesystem stuff
mimeTypes = require("mime-types")
Promise = require("bluebird")
fs = Promise.promisifyAll(require("fs"))
recursiveReaddir = require("recursive-readdir")

# For all files in deploy dir
recursiveReaddir("./#{DIRECTORY_TO_DEPLOY}").then (files) ->
  itemCount = files.length
  # Strip the deploy dir from the path
  files = files.map (file) -> file.replace("#{DIRECTORY_TO_DEPLOY}/", "")
  # Start uploading in parallel
  console.log("Uploading #{itemCount} files...")
  Promise.map files, uploadFileToS3, concurrency: 10

  .then ->
    console.log("Invalidating CloudFront cache...")
    cloudfront.createInvalidation
      DistributionId: CLOUDFRONT_DISTRIBUTION_ID
      InvalidationBatch:
        CallerReference: String(Date.now())
        Paths:
          Quantity: 1
          Items: [ '/*' ]
    .promise()

  .then ->
    console.log("Done.")

uploadFileToS3 = (file) ->
  mimeType = mimeTypes.lookup(file) || 'application/octet-stream'

  s3.putObject({
    Bucket: TARGET_BUCKET
    Key:    file
    Body:   fs.createReadStream("./#{DIRECTORY_TO_DEPLOY}/#{file}")
    ACL:    'public-read'
    ContentDisposition: 'inline'
    ContentType: mimeType

  }).promise()

  .then ->
    console.log "Uploaded #{file}, #{mimeType}"

  .catch (error) ->
    console.log(error)
    throw error
