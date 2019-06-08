import { concat, filter, find, flatten, keys, map, reduce } from 'lodash'
import axios from 'axios'
import GOOGLE_FONT_API_KEY from "../../.api_keys.json"

const
  GOOGLE_FONT_ENDPOINT = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONT_API_KEY}`,

  FontsModule = {
    state: {
      googleFonts: []
    },

    getters: {
      allFonts(_, getters) {
        return concat(getters.pdfFonts, getters.googleFonts)
      },

      // built-in PDF fonts
      pdfFonts() {
        return [
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
        ]
      },

      googleFonts: (state) => {
        return reduce(state.googleFonts, (acc, font) => {
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
          layers = rootGetters.findAllTemplateLayers(template),
          textLayers = filter(layers, { type: 'text' }),
          fonts = reduce(textLayers, (acc, textLayer) => {
            const googleFont = find(state.googleFonts, { family: textLayer.textFontName })
            if(googleFont) {
              acc.push({
                family: textLayer.textFontName,
                variant: textLayer.textFontStyle,
                location: googleFont.variants[textLayer.textFontStyle]
              })
            }

            return acc
          }, [])

        return fonts
      },

      allFontsForGame: (state, getters, rootState, rootGetters) => (game) => {
        const
          components = rootGetters.findAllGameComponents(game),
          fonts = flatten(map(components, (component) => getters.allFontsForComponent(component)))

        return fonts
      }
    },

    mutations: {
      setGoogleFonts(state, newGoogleFonts) {
        state.googleFonts = newGoogleFonts
      }
    },

    actions: {
      fetchGoogleFonts({ commit }) {
        return axios.get(GOOGLE_FONT_ENDPOINT)
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
      },
    }
  }

export default FontsModule
