/* global google */
import { getAccessToken } from './auth'
import { getKey } from '../keys.js'

const
  GOOGLE_PICKER_KEY = getKey("google", "picker"),

  pickerCallback = function(resolve) {
    return function(data) {
      if(data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        const doc = data[google.picker.Response.DOCUMENTS][0]
        resolve(doc[google.picker.Document.ID])
      }
    }
  },

  configurePicker = function(configFunc) {
    return new Promise((resolve) => {
      getAccessToken().then((oauthToken) => {
        const picker = new google.picker.PickerBuilder()
          .setOAuthToken(oauthToken)
          .setDeveloperKey(GOOGLE_PICKER_KEY)
          .setCallback(pickerCallback(resolve))

        configFunc(picker)

        picker
          .build()
          .setVisible(true)
      })
    })
  }

export const
  openSheetPicker = function(parentId) {
    if(!parentId) {
      throw new Error("Google Picker invoked without a parent folder id!")
    }

    return configurePicker((picker) => {
      // picker.addView(google.picker.ViewId.SPREADSHEETS)
      picker.addView(new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
        // scope the Picker, probably to the working folder
        .setParent(parentId)
        // allows user to drill down manually or search
        .setIncludeFolders(true))
    })
  },

  openImagePicker = function(parentId) {
    if(!parentId) {
      throw new Error("Google Picker invoked without a parent folder id!")
    }

    return configurePicker((picker) => {
      picker.addView(new google.picker.DocsView()
        // scope the Picker, probably to the working folder
        .setParent(parentId)
        // allows user to drill down manually or search
        .setIncludeFolders(true))
    })
  }


export default {
  openSheetPicker,
  openImagePicker
}
