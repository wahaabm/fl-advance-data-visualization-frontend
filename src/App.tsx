// App.tsx
import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAppDispatch } from './hooks/hooks'
import router from './routes/router'
import { refreshSettings } from './store/slices/SettingsSlice'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL

  async function fetchSettings() {
    try {
      const response = await fetch(`${HOST}/settings`, {
        method: 'GET',
      })

      const settingsData = await response.json()

      if (settingsData) {
        dispatch(refreshSettings(settingsData))
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    }

    console.log('settings fetched')
  }

  useEffect(() => {
    setInterval(() => {
      fetchSettings()
    }, 5000)
  }, [dispatch])

  return <RouterProvider router={router} />
}

export default App
