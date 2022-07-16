const KEYS = {
  "google": {
    "app_id": import.meta.env.VITE_GOOGLE_APP_ID,
    "client_id": import.meta.env.VITE_GOOGLE_CLIENT_ID,
    "picker": import.meta.env.VITE_GOOGLE_PICKER,
    "fonts": import.meta.env.VITE_GOOGLE_FONTS,
  }
}

export const
  getKey = (namespace, keyName) => {
    return KEYS[namespace][keyName]
  }
