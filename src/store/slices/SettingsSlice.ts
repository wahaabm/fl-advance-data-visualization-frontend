import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

initialState.settings = JSON.parse(localStorage.getItem('settings'))

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    refreshSettings: (state, action: PayloadAction<Settings>) => {
      localStorage.setItem('settings', JSON.stringify(action.payload))
      state.settings = action.payload
    },
  },
})

export const { refreshSettings } = settingsSlice.actions

export default settingsSlice.reducer
