import { useAppDispatch } from '../hooks/hooks'
import { authorizeUser } from '../store/slices/AuthSlice'

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
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL

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
      <div className='modal-box'>
        <div className='overflow-x-auto'>
          <p className='font-bold text-2xl text-center'>Available Users</p>
          <br />
          <table className='table'>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <th>{index + 1}.</th>
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
          </table>
        </div>

        <button
          className='btn mt-8'
          onClick={() => {
            ;(
              document.getElementById('users_modal') as HTMLDialogElement
            )?.close()
          }}
        >
          Close
        </button>
      </div>
    </dialog>
  )
}
