import parseColor from 'color-parse'
import { find } from 'lodash'

export const
  findProperty = function(item, key) {
    const property = find(item, { key })
    if(property) {
      return property.value
    } else {
      console.log(`No property found by key: ${key}`)
      return ""
    }
  },

  scaleDimensions = ({ x, y, w, h }, scale) => {
    return {
      x: x * scale,
      y: y * scale,
      w: w * scale,
      h: h * scale,
    }
  },

  percentOfParent = function(dimensions, parent) {
    const percentDimensions = scaleDimensions(dimensions, .01)
    return {
      x: (percentDimensions.x*parent.w)+(parent.x || 0),
      y: (percentDimensions.y*parent.h)+(parent.y || 0),
      w: percentDimensions.w*parent.w,
      h: percentDimensions.h*parent.h,
    }
  },

  // extract RGB255 from hex
  hexToRGB = (hex) => {
    return {
      r: parseInt(`${hex[1]}${hex[2]}`, 16),
      g: parseInt(`${hex[3]}${hex[4]}`, 16),
      b: parseInt(`${hex[5]}${hex[6]}`, 16),
    }
  },

  anyToRGB = function(fuzzyInput) {
    const
      parsedColor = parseColor(fuzzyInput),
      { 0: r, 1: g, 2: b } = parsedColor.values

    return { r, g, b }
  }
