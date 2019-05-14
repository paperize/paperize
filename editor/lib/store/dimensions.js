import uuid from 'uuid/v4'
import { generateCrud } from './util/vuex_resource'

export const SAME_AS_PARENT = "sameAsParent",
  PERCENT_OF_PARENT = "percentOfParent",
  OFFSET_FROM_PARENT = "offsetFromParent"

const DimensionModel = {
  name: 'dimensions',

  create() {
    return {
      id:   uuid(),
      mode: SAME_AS_PARENT,
      x:    5,
      y:    5,
      w:    90,
      h:    90
    }
  }
}

const DimensionModule = generateCrud(DimensionModel)

export default DimensionModule
