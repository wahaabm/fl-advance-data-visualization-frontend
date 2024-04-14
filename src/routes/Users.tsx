import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAppDispatch } from '../hooks/hooks'
import { authorizeUser, logout, revokeUser } from '../store/slices/AuthSlice'
import Loading from '../utils/Loading'
interface user {
  id: string
  email: string
  name: string
  role: string
  isAuthorized: boolean
  createdAt: string
  updatedAt: string
}

export default function ShowUsers() {
  const token = localStorage.getItem('token')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [users, setUsers] = useState<user[]>([])
  const [loading, setLoading] = useState(false)
  const HOST = import.meta.env.VITE_REACT_API_URL
  const [, setTitle, setDescription] = useOutletContext() as [
    boolean,
    Function,
    Function
  ]
  useEffect(() => {
    setTitle('Users dashboard')
    setDescription('Monitor and manage user authorization and profiles.')
  }, [])

  async function fetchUsers() {
    setLoading(true)
    if (!token) {
      return
    }

    try {
      const response = await fetch(`${HOST}/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status == 403) {
        dispatch(logout())
        navigate('/login')
      }

      const usersData = await response.json()
      setUsers(usersData)
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAuthorize = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${HOST}/admin/allowUser/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        dispatch(authorizeUser())
        fetchUsers()
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

  const handleRevoke = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${HOST}/admin/revokeUser/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        dispatch(revokeUser())
        fetchUsers()
      } else {
        navigate('/login')
        throw new Error('Forbidden')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    )

  return (
    <div className='w-full max-w-5xl mx-auto'>
      {users.length == 0 ? (
        <div className='flex flex-col w-72 md:w-max items-center'>
          <p className='text-lg md:text-3xl text-center text-gray-600 dark:text-gray-400'>
            No users are currently available. <br />
            <span className='text-lg md:text-xl text-center text-gray-600 dark:text-gray-400'>
              New users will be listed here for approval or role upgrade.
            </span>
          </p>
        </div>
      ) : (
        <>
          <div></div>
          <table className='table w-full bg-white dark:bg-darkmode-gray shadow-md'>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Date created</th>
                <th>Authorization</th>
                <th>Allow/Revoke</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  className='hover'
                  key={user.id}
                >
                  <td>{index + 1}.</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className='hidden md:table-cell '>
                    {user.createdAt.split('T')[0]}
                  </td>
                  <td>{user.isAuthorized ? 'Authorized' : 'Unauthorized'}</td>
                  <td>
                    <button
                      className={
                        user.isAuthorized
                          ? 'btn btn-ghost btn-sm'
                          : 'btn btn-primary btn-sm'
                      }
                      onClick={() =>
                        user.isAuthorized
                          ? handleRevoke(user.id)
                          : handleAuthorize(user.id)
                      }
                    >
                      {loading ? (
                        <span className='loading loading-spinner loading-md'></span>
                      ) : user.isAuthorized ? (
                        'Revoke access'
                      ) : (
                        'Allow access'
                      )}{' '}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
