import uuid from 'uuid/v4'
import { generateCrud } from './util/vuex_resource'

export const
  // Parent Modes
  SAME_AS_PARENT = "sameAsParent",
  PERCENT_OF_PARENT = "percentOfParent",
  OFFSET_FROM_PARENT = "offsetFromParent",
  PARENT_MODES = [SAME_AS_PARENT, PERCENT_OF_PARENT, OFFSET_FROM_PARENT],

  // Unit Modes
  PERCENT = "percent",
  PIXELS = "pixels",
  INCHES = "inches",
  MILLIMETERS = "millimeters",
  UNIT_MODES = [PERCENT, PIXELS, INCHES, MILLIMETERS],

  // Layout Modes
  XYWH = "xywh",
  INSET = "inset",
  LAYOUT_MODES = [XYWH, INSET]

const DimensionModel = {
  name: 'dimensions',

  create: (dimensionObject) => ({
    mode:   SAME_AS_PARENT,
    units:  PERCENT,
    layout: XYWH,
    x:      5,
    y:      5,
    w:      90,
    h:      90,
    ...dimensionObject,
    id: uuid()
  }),
}

const DimensionModule = generateCrud(DimensionModel)

export default DimensionModule
