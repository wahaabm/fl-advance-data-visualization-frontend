import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SocialLinks from '../components/SocialLinks'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { logout } from '../store/slices/AuthSlice'

export default function Dashboard() {
  const [displayMode, setDisplayMode] = useState<boolean>(() => {
    const localDisplayMode = localStorage.getItem('displayMode')
    return localDisplayMode === 'dark' ? true : false
  })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const location = useLocation()
  const [selectedOption, setSelectedOption] = useState(location.pathname)
  const navigate = useNavigate()
  const role = useAppSelector((state) => state.auth.role)
  const userName = useAppSelector((state) => state.auth.userName)
  const dispatch = useAppDispatch()
  const token = localStorage.getItem('token')

  const gotoSettings = () => {
    setSelectedOption('Settings')
    setTitle('Settings Dashboard')
    setDescription('Manage and view site settings.')
    navigate('/settings')
  }

  const handleSignOut = () => {
    const confirmed = window.confirm('Are you sure you want to logout?')
    if (!confirmed) return
    else {
      dispatch(logout())
      navigate('/login')
    }
  }

  useEffect(() => {
    localStorage.setItem('displayMode', displayMode ? 'dark' : 'light')
    document.documentElement.setAttribute(
      'data-theme',
      displayMode ? 'dark' : 'light'
    )
    document.documentElement.classList.toggle('dark', displayMode)
  }, [displayMode])

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      if (decodedToken.exp! < currentTime) {
        console.log('Token is expired')
        localStorage.removeItem('token')
        navigate('/login')
      } else {
        console.log(
          location.pathname.substring(1).charAt(0).toUpperCase() +
            location.pathname.substring(2)
        )
        setSelectedOption(
          location.pathname.substring(1).charAt(0).toUpperCase() +
            location.pathname.substring(2)
        )
      }
    }
  }, [token, navigate, location.pathname])

  const handleSelectChange = (event) => {
    const value = event.target.value
    if (value === 'Articles') {
      setTitle('Articles dashboard')
      setDescription('Manage and view all articles at a glance.')
      navigate('/articles')
    } else if (value === 'Charts') {
      setTitle('Charts dashboard')
      setDescription(
        'Manage and visualize data and insights through interactive charts.'
      )
      navigate('/charts')
    } else if (
      value === 'Users' &&
      (role === 'ADMIN_USER' || role === 'EDITOR_USER')
    ) {
      setTitle('Users dashboard')
      setDescription('Monitor and manage user authorization and profiles.')
      navigate('/users')
    } else if (value === 'Editors' && role === 'ADMIN_USER') {
      setTitle('Editors dashboard')
      setDescription('Grant or revoke editor rights for users with ease.')
      navigate('/editors')
    } else if (value === 'Settings' && role === 'ADMIN_USER') {
      setTitle('Settings')
      setDescription('Setup site links and settings')
      navigate('/settings')
    }
  }

  return (
    <div>
      <div className='flex flex-col md:px-10 mx-auto justify-between navbar border-b-2 border-white dark:border-gray-500 p-2 fixed top-0 z-10 bg-base-300 dark:text-gray-200 w-full left-0 md:flex-row gap-4'>
        <a
          className='flex flex-col justify-center'
          href='/'
        >
          <img
            src='/finallogo.svg'
            alt='Macrobourse Logo'
            width={96}
          />
          <div className='text-lg md:text-lg'>Macrobourse</div>
        </a>

        <div className='flex-col flex-1 text-center'>
          <h1 className='text-3xl font-bold'>{title}</h1>
          <p>{description}</p>
        </div>

        <div className='flex md:flex-col-reverse gap-2'>
          <div>
            <label className='form-control min-w-48'>
              {/* <div className="label">
                <p className="label-text">Key categories</p>
              </div> */}
              <select
                value={selectedOption} // Add this line to set the value based on selectedOption
                className='select select-bordered md:select-md '
                onChange={handleSelectChange}
              >
                <option value='Articles'>Articles</option>
                <option value='Charts'>Charts</option>
                {(role === 'ADMIN_USER' || role === 'EDITOR_USER') && (
                  <option value='Users'>Users</option>
                )}
                {role === 'ADMIN_USER' && (
                  <option value='Editors'>Editors</option>
                )}
                {role === 'ADMIN_USER' && (
                  <option value='Settings'>Settings</option>
                )}
              </select>
            </label>
          </div>

          <div className='dropdown dropdown-end self-end'>
            <div className='flex flex-row-reverse md:flex-row gap-x-5 items-center text-lg'>
              <div>Hello, {userName}</div>
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost btn-circle avatar'
              >
                <div className='w-10 rounded-full'>
                  <img
                    alt='Tailwind CSS Navbar component'
                    src='https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
                  />
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className='mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52'
            >
              <li>
                <label className='label cursor-pointer'>
                  <span className='label-text'>Dark mode</span>
                  <input
                    type='checkbox'
                    className='toggle'
                    onChange={() => {
                      const newDisplayMode = !displayMode
                      setDisplayMode(newDisplayMode)
                      document.documentElement.setAttribute(
                        'data-theme',
                        newDisplayMode ? 'dark' : 'light'
                      )
                      document.documentElement.classList.toggle(
                        'dark',
                        displayMode
                      )
                      localStorage.setItem(
                        'displayMode',
                        displayMode ? 'dark' : 'light'
                      )
                    }}
                    checked={displayMode}
                  />
                </label>
              </li>
              <li>
                {(role === 'ADMIN_USER' || role === 'EDITOR_USER') && (
                  <a onClick={gotoSettings}>Settings</a>
                )}
              </li>
              <li>
                <a
                  type='button'
                  onClick={handleSignOut}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='container mx-auto py-72 md:py-36 px-6'>
        <Outlet context={[displayMode, setTitle, setDescription]} />
      </div>

      <footer className='flex flex-row justify-between footer items-center p-4 bg-base-300 fixed bottom-0 border-white border-t-2 dark:border-gray-500'>
        <aside className='items-center flex flex-row'>
          <img
            src='/finallogo.svg'
            alt='Macrobourse Logo'
            width={96}
          />

          <p>Copyright © 2024 - All right reserved</p>
        </aside>

        <SocialLinks />
      </footer>
    </div>
  )
}
