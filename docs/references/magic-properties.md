---
slug: magic-properties
title: Magic Properties Reference
---

# Magic Properties

Paperize has a powerful Template Editor built-in that allows you to make all items of one component look the same, but it can do even more. With Magic Properties, a spreadsheet can set dynamic parts of a template, so individual items can have different background colors, shapes, font sizes, etc.

## How to Set a Magic Property

The simple formula for a Magic Property column is:

`[Layer Name]:[Attribute Name]`

So, for a Text Layer named "Card Title", in order to set the font size for different cards, you would look up the appropriate attribute below under Text Layer Attributes and see that it is in fact `textSize`. So simply name the column:

`Card Title:textSize`

...and then fill in the cells with numbers representing the font size you want for that particular component.

## Shape Layer Attributes

- `shape`: must be `rectangle`, `roundedRectangle`, or `ellipse`
- `strokePresent`: `true` or `false`
- `strokeWidth`: a numeric value in inches, `.01` to `.5` are reasonable values
- `strokeColor`: `red`, or `rgb(200, 0, 0)`, or `#DD0000`, anything that can be parsed as a color
- `fillPresent`: `true` or `false`
- `fillColor`: `red`, or `rgb(200, 0, 0)`, or `#DD0000`, anything that can be parsed as a color

## Text Layer Attributes

- `textColor`: `red`, or `rgb(200, 0, 0)`, or `#DD0000`, anything that can be parsed as a color
- `textSize`: a numeric value in points, `4` to `128` are reasonable values
- `horizontalAlignment`: must be `left`, `right`, or `center`
- `verticalAlignment`: must be `top`, `bottom`, or `middle`

## Image Layer Attributes

- `imageScaling`: must be `fitToBox`, `fillToBox`, or `stretch`
- `horizontalAlignment`: must be `left`, `right`, or `center`
- `verticalAlignment`: must be `top`, `bottom`, or `middle`
