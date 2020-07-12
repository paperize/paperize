import Konva from 'konva'
import { defaults, map } from 'lodash'

export const
  renderItemsToCanvas = (items, canvasId, canvasWidth, canvasHeight, renderOptions={}) => {
    renderOptions = defaults(renderOptions, {
      imageSmoothing: true
    })

    const
      // Canvas, Dimensions & CSS, Konva.Stage(dimensions)
      stage = new Konva.Stage({
        container: canvasId,
        width:  canvasWidth,
        height: canvasHeight
      }),

      layer = new Konva.Layer()

    stage.add(layer)

    if(!renderOptions.imageSmoothing) {
      const nativeCtx = layer.getContext()._context
      nativeCtx.webkitImageSmoothingEnabled = false
      nativeCtx.mozImageSmoothingEnabled = false
      nativeCtx.imageSmoothingEnabled = false
    }

    // items become Konva Groups and Nodes
    const groups = itemsToGroups(items)
    if(groups.length > 0) {
      layer.add(...groups)
    }
    // add to the stage, call .draw() or .download() or .exportToDrive()
    stage.draw()
  },

  // items become Konva Groups containing:
  // layers which become Konva primitives (or Groups of primitives!)
  itemsToGroups = (items) => {
    return map(items, (item) => {
      const
        itemGroup = new Konva.Group(),
        layerNodes = layersToNodes(item.layers)

      itemGroup.add(...layerNodes)

      return itemGroup
    })
  },

  layersToNodes = (layers) => {
    return map(layers, layerTypeStrategy)
  },

  layerTypeStrategy = (layer) => {
    return strategy("Layer Type", layer.type, {
      "shape": renderShape,
      "text": renderText,
      "image": renderImage,
    })(layer)
  },

  strategy = (strategyName, selection, options) => {
    if(options[selection]) {
      return options[selection]
    } else {
      throw new Error(`Unknown ${strategyName}: ${selection}`)
    }
  },

  renderShape = (layer) => {
    // early out if no stroke or fill
    if(!layer.strokePresent && !layer.fillPresent) { return new Konva.Group() }

    const konvaShape = strategy("Shape", layer.shape, {
      "rectangle": () => {
        return new Konva.Rect({
          x: layer.dimensions.x,
          y: layer.dimensions.y,
          width: layer.dimensions.w,
          height: layer.dimensions.h,
        })
      },

      "roundedRectangle": () => {
        return new Konva.Rect({
          x: layer.dimensions.x,
          y: layer.dimensions.y,
          width: layer.dimensions.w,
          height: layer.dimensions.h,
          cornerRadius: 15,
        })
      },

      "ellipse": () => {
        return new Konva.Ellipse({
          x: (layer.dimensions.x+layer.dimensions.w/2),
          y: (layer.dimensions.y+layer.dimensions.h/2),
          radius: {
            x: layer.dimensions.w/2,
            y: layer.dimensions.h/2
          },
        })
      },
    })()

    if(layer.strokePresent) {
      konvaShape.stroke(layer.strokeColor.rgbaString)
      konvaShape.strokeWidth(layer.strokeWidth)
    }

    if(layer.fillPresent) {
      konvaShape.fill(layer.fillColor.rgbaString)
    }

    return konvaShape
  },

  renderText = (layer) => {
    // TODO: font face, variant

    //Konva looks for fonts embedded in the CSS of the app
    //The CSSFontLoadingAPI looks like a perfect candidate for doing this
    //via FontFace and FontFaceSet (document.fonts)

    //I imagine we will probably turn this into a utility function, 
    //or better yet create the FontFace when selecting the font.
    //I don't know if it adds duplicates of the FontFace on successive loads
    //so, I don't know if there is any need to check the font (document.fonts.check()) before adding it

    //Note: I did notice that font.load() must be called before every render, 
    //but document.fonts.add seems to only need to be called once?
    //need to do some more research

    //Create a new FontFace pointing to the font family and location
    let font = new FontFace(`${layer.font.family}`, `url(${layer.font.location})`)
    //Load FontFace and then add it
    font.load().then( face => {
        document.fonts.add(face)
    })

    // TODO: auto-shrink-to-fit
  
    //shrink-to-fit size, default is textSize + 1 because of do-while loop
    let _size = layer.textSize + 1;
    //dummy canvas context for doing text measuring, maybe cache it or delete it after use?
    let _dummy = document.createElement('canvas').getContext('2d')     

    let _min_w
    let _max_w
    let _max_h
    let _lines    

    do {
      _size --
      _min_w = Infinity
      _max_w = 0
      _max_h = 0
      _lines = []

      _dummy.font = `${_size}px ${layer.font.family}`

      // split text along new-lines
      for (const _raw of layer.renderedText.split(/\n/)) {
        let _raw_metrics = _dummy.measureText(_raw)

        // IF  : line width is in bounds
        if(_raw_metrics.width <= layer.dimensions.w) {
        // THEN: append line to array
          _lines.push(_raw)
          
          if(_min_w  > _raw_metrics.width) { _min_w = _raw_metrics.width } // track min width
          if(_max_w  < _raw_metrics.width) { _max_w = _raw_metrics.width } // track max width
          _max_h += _size; // track max height

        } else {
          // ELSE: split line along word boundaries (honoring whitespace)                                    
          let _line = '' // line buffer
          let _word = '' // word buffer

          for(const _token of _raw) { // iterate over tokens in string
            _word += _token
            
            // NOTE: not sure about using a switch here, feels hard coded and gross... but
            // an if statement would also be. (maybe use a regex? or a custom array of word
            // boundary tokens)

            switch(_token) {
              case ' ' : // fall thru
              case '-' : // fall thru
              case '\t': { // token is a word boundary character          
                let _line_metrics = _dummy.measureText(_line)
                let _word_metrics = _dummy.measureText(_word)
                let _width = _line_metrics.width + _word_metrics.width

                // IF  : combined length is in bounds
                if(_width <= layer.dimensions.w) {
                // THEN: append word to line buffer
                  _line += _word
                } else {
                // ELSE: append line to array
                  _lines.push(_line)

                  if(_min_w  > _line_metrics.width) { _min_w = _line_metrics.width } // track min width
                  if(_max_w  < _line_metrics.width) { _max_w = _line_metrics.width } // track max width
                  _max_h += _size // track max height

                  _line = _word // reset line buffer
                }                
                _word = ''      // reset word buffer
              } break
            }
          }

          // IF  : line buffer or word buffer is not empty (including whitespace)
          if(_line.length > 0 || _word.length > 0) {
          // THEN: append buffer(s) to array
            let _line_metrics = _dummy.measureText(_line)
            let _word_metrics = _dummy.measureText(_word)
            let _width = _line_metrics.width + _word_metrics.width
            if(_width <= layer.dimensions.w) {
              _lines.push(_line + _word)

              if(_min_w  > _width) { _min_w = _width; } // track min width
              if(_max_w  < _width) { _max_w = _width; } // track max width
              _max_h += _size; // track max height
            } else {
              if(_line.length > 0) {
                _lines.push(_line)

                if(_min_w  > _line_metrics.width) { _min_w = _line_metrics.width } // track min width
                if(_max_w  < _line_metrics.width) { _max_w = _line_metrics.width } // track max width
                _max_h += _size; // track max height
              }
              if(_word.length > 0) {
                _lines.push(_word)

                if(_min_w  > _word_metrics.width) { _min_w = _word_metrics.width } // track min width
                if(_max_w  < _word_metrics.width) { _max_w = _word_metrics.width } // track max width
                 _max_h += _size; // track max height
              }
            }
          }
        }
      }
    } while(_max_w > layer.dimensions.w || _max_h > layer.dimensions.h)

    return new Konva.Text({
      text: _lines.join('\n'), // join lines at custom breakpoints
      x: layer.dimensions.x,
      y: layer.dimensions.y,
      width: layer.dimensions.w,
      height: layer.dimensions.h,
      fontSize: _size,     
      fontFamily: layer.font.family,// font should now be available to Konva
      fill: layer.textColor.rgbaString,
      align: layer.horizontalAlignment,
      verticalAlign: layer.verticalAlignment
    })
  },

  renderImage = (layer) => {
    // TODO: alignment and shrink/stretch
    // const { horizontalAlignment, verticalAlignment, imageScaling } = layer
    return new Konva.Image({
      image: layer.image,
      x: layer.dimensions.x,
      y: layer.dimensions.y,
      width: layer.dimensions.w,
      height: layer.dimensions.h,
    })
  }
