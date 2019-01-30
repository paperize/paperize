/* global google */
import { getAccessToken } from './auth'

const googlePickerKey = "AIzaSyDNdLi_27Z_vhtfKCJldF_PEDiytvux1WM",

  openDrivePicker = function() {
    return new Promise((resolve) => {
      getAccessToken().then((oauthToken) => {
        const pickerCallback = function(data) {
          console.log("come on back picker:", data)
          if(data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            const doc = data[google.picker.Response.DOCUMENTS][0]
            resolve(doc[google.picker.Document.ID])
          }
        }

        const picker = new google.picker.PickerBuilder()
          .addView(google.picker.ViewId.SPREADSHEETS)
          .setOAuthToken(oauthToken)
          .setDeveloperKey(googlePickerKey)
          .setCallback(pickerCallback)
          .build()

        picker.setVisible(true)
      })
    })
  }

export default {
  openDrivePicker
}
export { openDrivePicker }
