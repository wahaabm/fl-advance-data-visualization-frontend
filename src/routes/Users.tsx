import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import Loading from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { authorizeUser, logout, revokeUser } from '../store/slices/AuthSlice';
interface user {
  id: string;
  email: string;
  name: string;
  role: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ShowUsers() {
  const token = localStorage.getItem('token');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.role);
  const [users, setUsers] = useState<user[]>([]);
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL;
  const [, setTitle, setDescription] = useOutletContext() as [
    boolean,
    Function,
    Function,
  ];

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    if (isChecked) {
      if (selectedIds.includes(id)) {
        return;
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      if (selectedIds.includes(id)) {
        const updatedList = selectedIds.filter((sid) => sid !== id);
        setSelectedIds(updatedList);
      } else {
        return;
      }
    }
  };

  async function fetchUsers() {
    setLoading(true);
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
      setUsers(usersData);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBulkAuthorize = async () => {
    setBulkLoading(true);

    try {
      for (let i = 0; i < selectedIds.length; i += 1) {
        const id = selectedIds[i];
        await handleAuthorize(id);
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }

    setBulkLoading(false);
  };

  const allowAllUsers = async () => {
    setBulkLoading(true);

    try {
      const res = await fetch(`${HOST}/admin/allowAllUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchUsers();
      } else {
        alert(res.statusText);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setBulkLoading(false);
    }
  };

  const revokeAllUsers = async () => {
    setBulkLoading(true);

    try {
      const res = await fetch(`${HOST}/admin/revokeAllUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchUsers();
      } else {
        alert(res.statusText);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleAuthorize = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${HOST}/admin/allowUser/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(authorizeUser());
        fetchUsers();
      } else {
        navigate('/login');
        throw new Error('Forbidden');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${HOST}/admin/revokeUser/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(revokeUser());
        fetchUsers();
      } else {
        navigate('/login');
        throw new Error('Forbidden');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTitle('Users dashboard');
    setDescription('Monitor and manage user authorization and profiles.');
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {users.length == 0 ? (
        <div className="mt-12">
          <p className="text-lg md:text-xl text-center">
            No users are currently available. <br />
            <span className="text-center text-gray-600 dark:text-gray-400">
              New users will be listed here for approval or role upgrade.
            </span>
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-x-4 justify-end mb-6">
            {(role == 'ADMIN_USER' || role === 'EDITOR_USER') && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleBulkAuthorize}
                  disabled={bulkLoading || selectedIds.length === 0}
                >
                  {bulkLoading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    'Allow Selected Users'
                  )}{' '}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={allowAllUsers}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    'Allow All Users'
                  )}{' '}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={revokeAllUsers}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    'Revoke All Users'
                  )}{' '}
                </button>
              </>
            )}
          </div>
          <table className="table w-full bg-white dark:bg-darkmode-gray shadow-md">
            <thead>
              <tr>
                <th></th>
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
                  className="hover"
                  key={user.id}
                >
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(user.id, e.target.checked)
                      }
                    />
                  </td>
                  <td>{index + 1}.</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="hidden md:table-cell ">
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
                        <span className="loading loading-spinner loading-md"></span>
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
  );
}
