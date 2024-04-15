import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import ReactPixel from 'react-facebook-pixel'
import TagManager from 'react-gtm-module'

export async function initializeFacebookPixel() {
  const { facebookPixelId } = initialState.settings

  ReactPixel.init(facebookPixelId, null, {
    autoConfig: true,
    debug: false,
  })
}

export async function initializeGoogleTagManager() {
  const { googleTagManager } = initialState.settings

  TagManager.initialize({
    gtmId: googleTagManager,
  })
}

export interface Settings {
  googleTagManager: string
  facebookPixelId: string
  facebookPixelToken: string
  twitter: string
  facebook: string
  linkedIn: string
  youtube: string
  previous: string
  actual: string
}

const initialState: {
  settings: Settings
} = {
  settings: {
    actual: '',
    facebook: '',
    facebookPixelId: '',
    facebookPixelToken: '',
    googleTagManager: '',
    linkedIn: '',
    previous: '',
    twitter: '',
    youtube: '',
  },
}

initialState.settings =
  JSON.parse(localStorage.getItem('settings') || '{}') || {}

initializeFacebookPixel()
initializeGoogleTagManager()

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    refreshSettings: (state, action: PayloadAction<Settings>) => {
      localStorage.setItem('settings', JSON.stringify(action.payload))
      state.settings = action.payload
      // initialState.settings = action.payload

      initializeFacebookPixel()
      initializeGoogleTagManager()
    },
  },
})

export const { refreshSettings } = settingsSlice.actions

export default settingsSlice.reducer
