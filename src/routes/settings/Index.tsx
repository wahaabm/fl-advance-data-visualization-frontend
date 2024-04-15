import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Loading from '../../components/Loading'
import { useAppDispatch } from '../../hooks/hooks'
import { logout } from '../../store/slices/AuthSlice'
import { refreshSettings } from '../../store/slices/SettingsSlice'

export default function SettingsForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    googleTagManager: '',
    facebookPixelId: '',
    facebookPixelToken: '',
    twitter: '',
    facebook: '',
    linkedIn: '',
    youtube: '',
    previous: '',
    actual: '',
  })
  const [, setTitle, setDescription] = useOutletContext() as [
    Boolean,
    Function,
    Function
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setSettings({
      ...settings,
      [name]: value,
    })
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${HOST}/admin/settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        console.log('settings saved')
        const settingsData = await res.json()
        setSettings(settingsData)
        dispatch(refreshSettings(settingsData))
      } else {
        navigate('/login')
        throw new Error('Forbidden')
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSettings() {
    setLoading(true)
    if (!token) {
      return
    }

    try {
      const response = await fetch(`${HOST}/settings`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status == 403) {
        dispatch(logout())
        navigate('/login')
      }

      const settingsData = await response.json()

      if (settingsData) {
        setSettings(settingsData)
        dispatch(refreshSettings(settingsData))
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTitle('Settings dashboard')
    setDescription('Setup site links and settings')
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [])

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    )

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Site Settings</h2>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>
          Google Tag Manager
        </label>
        <input
          name='googleTagManager'
          value={settings.googleTagManager}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='GTM-XXXXXX'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>
          Facebook Pixel ID
        </label>
        <input
          name='facebookPixelId'
          value={settings.facebookPixelId}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='167505060126596'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>
          Twitter Address
        </label>
        <input
          name='twitter'
          value={settings.twitter}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='Enter Twitter URL'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>
          Facebook Address
        </label>
        <input
          name='facebook'
          value={settings.facebook}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='Enter Facebook URL'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>linkedIn</label>
        <input
          name='linkedIn'
          value={settings.linkedIn}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='Enter linkedIn Address'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>
          Youtube Channel
        </label>
        <input
          name='youtube'
          value={settings.youtube}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='Enter Youtube Channel'
        />
      </div>

      <h2 className='text-xl font-bold mb-4'>Charts Settings</h2>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>
          Previous Quarter
        </label>
        <input
          name='previous'
          value={settings.previous}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='Previous: Q1'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Actual Quarter</label>
        <input
          name='actual'
          value={settings.actual}
          onChange={handleInputChange}
          type='text'
          className='input input-bordered w-full'
          placeholder='Actual: Q4'
        />
      </div>

      <div>
        <button
          onClick={saveSettings}
          className='btn btn-primary'
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
