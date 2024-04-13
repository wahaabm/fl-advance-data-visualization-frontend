import { useAppDispatch } from '../../hooks/hooks'
import { authorizeUser } from '../../store/slices/AuthSlice'

interface user {
  id: string
  email: string
  name: string
  role: string
  isAuthorized: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  fetchEditors: () => void
  fetchUsers: () => void
  users: user[]
}

export default function ShowUsersModal({
  fetchEditors,
  fetchUsers,
  users,
}: Props) {
  const token = localStorage.getItem('token')
  const dispatch = useAppDispatch()
  const HOST = import.meta.env.VITE_REACT_API_URL

  const handleMakeEditor = async (id: string) => {
    try {
      const res = await fetch(`${HOST}/admin/makeEditor/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        dispatch(authorizeUser())
        fetchUsers()
      } else {
        throw new Error('Forbidden')
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      fetchEditors()
    }
  }

  return (
    <dialog
      id='users_modal'
      className='modal'
    >
      <div className='modal-box bg-gray-100 dark:bg-gray-800'>
        <div className='overflow-x-auto'>
          <p className='font-bold text-2xl text-center'>Users list</p>
          <table className='table table-zebra table-xs md:table-sm'>
            <thead className='text-lg'>
              <tr>
                <th className='hidden md:block'></th>
                <th>Name</th>
                <th>Email</th>
                <td>Make editor</td>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <th className='hidden md:block'>{index + 1}</th>{' '}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className='btn btn-sm'
                      onClick={() => handleMakeEditor(user.id)}
                    >
                      Make editor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button
              className='btn btn-ghost'
              onClick={() => {
                ;(
                  document.getElementById('users_modal') as HTMLDialogElement
                )?.close()
              }}
            >
              close
            </button>
          </table>
        </div>
      </div>
    </dialog>
  )
}
