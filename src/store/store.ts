import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/AuthSlice'
import settingsReducer from './slices/SettingsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
