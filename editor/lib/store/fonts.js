import { concat, keys, reduce } from 'lodash'
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

      allFontsForItem: (state, getters, rootState, rootGetters) => (item) => {
        return [{
          family: "Permanent Marker",
          variant: "regular",
          location: "/PermanentMarker.ttf"
        }]
      },

      allFontsForGame: (state, getters, rootState, rootGetters) => (game) => {
        return [{
          family: "Permanent Marker",
          variant: "regular",
          location: "/PermanentMarker.ttf"
        }]
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
