import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import Loading from '../../components/Loading';
import ShowUsersModal from '../../components/UsersDialogue';
import { useAppDispatch } from '../../hooks/hooks';
import { logout, revokeUser } from '../../store/slices/AuthSlice';

interface user {
  id: string;
  email: string;
  name: string;
  role: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ShowEditors() {
  const token = localStorage.getItem('token');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editors, setEditors] = useState<user[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<user[]>([]);
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL;
  const [, setTitle, setDescription] = useOutletContext() as [
    Boolean,
    Function,
    Function,
  ];

  useEffect(() => {
    setTitle('Editors dashboard');
    setDescription('Grant or revoke editor rights for users with ease.');
  }, []);

  async function fetchEditors() {
    setLoading(true);
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${HOST}/admin/editors`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 403) {
        dispatch(logout());
        navigate('/login');
      }

      const editorData = await response.json();
      setEditors(editorData);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${HOST}/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 403) {
        dispatch(logout());
        navigate('/login');
      }

      const usersData = await response.json();
      const normalUsers = usersData.filter(
        (user: user) => user.role === 'NORMAL_USER',
      );

      setUsers(normalUsers);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  useEffect(() => {
    fetchEditors();
  }, [token]);

  const handleRemoveEditor = async (id: string) => {
    try {
      const res = await fetch(`${HOST}/admin/removeEditor/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(revokeUser());
        fetchEditors();
      } else if (res.status == 403) {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <ShowUsersModal
        fetchEditors={fetchEditors}
        fetchUsers={fetchUsers}
        users={users}
      />

      <div className="flex gap-x-4 justify-end mb-6">
        <button
          className="btn btn-primary"
          onClick={async () => {
            await fetchUsers();
            (
              document.getElementById('users_modal') as HTMLDialogElement
            )?.showModal();
          }}
        >
          Add Editor
        </button>
      </div>

      <div>
        {editors.length == 0 ? (
          <div>
            <p className="text-lg md:text-xl text-center mt-8">
              No editors are currently available. <br />
              <span className="text-center text-gray-600 dark:text-gray-400">
                You can start by adding a new editor using the button below.
              </span>
            </p>
          </div>
        ) : (
          <>
            <table className="table w-full bg-white dark:bg-darkmode-gray shadow-md">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date created</th>
                  <th>Authorization</th>
                  <td>Remove editor</td>
                </tr>
              </thead>
              <tbody>
                {editors.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover"
                  >
                    <td>{index + 1}.</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.createdAt.split('T')[0]}</td>
                    <td>{user.isAuthorized ? 'Authorized' : 'Unauthorized'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleRemoveEditor(user.id)}
                      >
                        Remove editor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
