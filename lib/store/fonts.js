import { concat, filter, find, flatten, includes, keys, map, reduce } from 'lodash'
import axios from 'axios'
import { getKey } from "../services/keys.js"

const
  GOOGLE_FONT_KEY = getKey("google", "fonts"),
  GOOGLE_FONT_ENDPOINT = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONT_KEY}`,

  FontsModule = {
    state: {
      googleFonts: [],
      requestPromise: null
    },

    getters: {
      allFonts(_, getters) {
        return concat(getters.pdfFonts, getters.googleFonts)
      },

      // built-in PDF fonts
      pdfFonts: () => [
        { family: "helvetica",
          variants: ["normal", "bold", "italic", "bolditalic"] },
        { family: "courier",
          variants: ["normal", "bold", "italic", "bolditalic"] },
        { family: "times",
          variants: ["normal", "bold", "italic", "bolditalic"] },
        { family: "symbol",
          variants: ["normal"] },
        { family: "zapfdingbats",
          variants: ["normal"] }
      ],

      googleFontsRaw: (state) => state.googleFonts,

      googleFonts: (_, getters) => {
        return reduce(getters.googleFontsRaw, (acc, font) => {
          acc.push({
            family: font.family,
            variants: keys(font.variants)
          })
          return acc
        }, [])
      },

      allFontsForComponent: (state, getters, rootState, rootGetters) => (component) => {
        const
          template = rootGetters.findComponentTemplate(component),
          layers = template ? rootGetters.findAllTemplateLayers(template) : [],
          textLayers = filter(layers, { type: 'text' }),
          fonts = reduce(textLayers, (acc, textLayer) => {
            const
              family = textLayer.textFontName,
              variant = textLayer.textFontStyle,
              googleFont = find(getters.googleFontsRaw, { family }),
              location = googleFont && googleFont.variants[variant]

            const defaultFontFamilies = ["helvetica", "courier", "times", "symbol", "zapfdingbats"]
            if(location || !includes(defaultFontFamilies, family) ) {
              // return it if it's got a location or isn't a built-in font
              acc.push({ family, variant, location })
            }

            return acc
          }, [])

        return fonts
      },

      allFontsForGame: (state, getters, rootState, rootGetters) => (game) => {
        const
          components = rootGetters.findAllGameComponents(game),
          componentFonts = map(components, (component) => getters.allFontsForComponent(component)),
          fonts = flatten(componentFonts)

        return fonts
      },

      requestPromise: (state) => state.requestPromise
    },

    mutations: {
      setGoogleFonts(state, newGoogleFonts) {
        state.googleFonts = newGoogleFonts
      },

      setRequestPromise(state, requestPromise) {
        state.requestPromise = requestPromise
      }
    },

    actions: {
      ensureFontsFetchedForGame({ dispatch, getters }, game) {
        // check the cache
        // check for existing request promise, return it
        if(getters.requestPromise) {
          return getters.requestPromise
        }
        // check if the game needs them
        const neededFonts = getters.allFontsForGame(game)

        // only hit API if new fonts are needed
        if(neededFonts.length > 0) {
          // fetch
          return dispatch("fetchGoogleFonts")
        }
      },

      fetchGoogleFonts({ commit, getters }) {
        // return early if we've already done this
        if(getters.requestPromise) {
          return getters.requestPromise
        }
        // create new request promise...
        const requestPromise = axios.get(GOOGLE_FONT_ENDPOINT)
          .then(response => {
            if(!response.data.items) {
              throw new Error("Bad Google Font API Response:\n"+response)
            }

            const processedResponse = reduce(response.data.items, (acc, item) => {
              acc.push({
                family: item.family,
                variants: item.files
              })
              return acc
            }, [])

            commit("setGoogleFonts", processedResponse)
          })
          .catch(error => {
            console.log(error)
          })

        // set promise on state so we can remember we've already done this
        commit("setRequestPromise", requestPromise)

        // hand it back
        return requestPromise
      },
    }
  }

export default FontsModule
