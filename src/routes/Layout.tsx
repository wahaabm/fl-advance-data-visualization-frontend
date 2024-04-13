import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { logout } from '../store/slices/AuthSlice'

export default function Dashboard() {
  const [displayMode, setDisplayMode] = useState<boolean>(() => {
    const localDisplayMode = localStorage.getItem('displayMode')
    return localDisplayMode === 'dark' ? true : false
  })
  const [title, setTitle] = useState('')
  const location = useLocation()
  const [description, setDescription] = useState('')
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
        <nav className='grid-flow-col gap-4 md:place-self-center md:justify-self-end'>
          <a href=''>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              className='fill-current'
            >
              <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'></path>
            </svg>
          </a>
          <a href=''>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              className='fill-current'
            >
              <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z'></path>
            </svg>
          </a>
          <a href=''>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              className='fill-current'
            >
              <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z'></path>
            </svg>
          </a>
        </nav>
      </footer>
    </div>
  )
}
