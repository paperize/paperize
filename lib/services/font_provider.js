import axios from 'axios'
import { includes } from 'lodash'
import { getCachedFont, setCachedFont } from './font_cache'

const addedFontLocations = []

export const getFontByLocation = (location) => {
  // check the cache first
  return getCachedFont(location)
    .then((fontBase64) => {
      if(fontBase64) {
        // cache hit, move on!
        return fontBase64
      } else {
        // cache miss, actually do the work
        return urlToBase64(location)
          // set cache
          .tap((fontBase64) => setCachedFont(location, fontBase64))
      }
    })
}

// Black magic I tell you.
function urlToBase64(url) {
  // strip the scheme off the url so it matches whatever we are
  url = url.replace(/^http(s?):/, "")
  return Promise.try(() => axios.get(url, { responseType: 'blob' })
    .then((response) => response.data)

    .then((blob) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        // Remove the DataURL preamble, like:
        // data:font/ttf;base64,
        // data:application/x-font-ttf;base64,
        const indexAfterPreamble = (reader.result.indexOf("base64,")+7),
          base64Font = reader.result.substr(indexAfterPreamble)
        resolve(base64Font)
      }
    }))
  )
}
