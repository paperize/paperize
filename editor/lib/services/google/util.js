// Via: https://stackoverflow.com/questions/16840038/easiest-way-to-get-file-id-from-url-on-google-apps-script
const GOOGLE_ID_REGEX = /[-\w]{25,}/
const matchGoogleId = (url) => {
  const match = url.match(GOOGLE_ID_REGEX)
  return match && match[0]
}

export { matchGoogleId }
