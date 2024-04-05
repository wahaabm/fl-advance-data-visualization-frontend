import { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { logout, revokeUser } from "../../store/slices/AuthSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import ShowUsersModal from "./UsersDialogue";
import Loading from "../../utils/Loading";

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
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editors, setEditors] = useState<user[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<user[]>([]);
  const HOST = import.meta.env.VITE_REACT_API_URL;
  const [, setTitle, setDescription] = useOutletContext() as [
    Boolean,
    Function,
    Function
  ];

  useEffect(() => {
    setTitle("Editors dashboard");
    setDescription("Grant or revoke editor rights for users with ease.");
  }, []);

  async function fetchEditors() {
    setLoading(true);
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${HOST}/admin/editors`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 403) {
        dispatch(logout());
        navigate("/login");
      }

      const editorData = await response.json();
      setEditors(editorData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
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
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 403) {
        dispatch(logout());
        navigate("/login");
      }

      const usersData = await response.json();
      const normalUsers = usersData.filter(
        (user: user) => user.role === "NORMAL_USER"
      );

      setUsers(normalUsers);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  useEffect(() => {
    fetchEditors();
  }, [token]);

  const handleRemoveEditor = async (id: string) => {
    try {
      const res = await fetch(`${HOST}/admin/removeEditor/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(revokeUser());
        fetchEditors();
      } else if (res.status == 403) {
        navigate("/login");
      }
    } catch (error) {
      console.log("error");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col overflow-x-auto justify-center max-w-min mx-auto md:pr-20">
      <ShowUsersModal
        fetchEditors={fetchEditors}
        fetchUsers={fetchUsers}
        users={users}
      />
      

      {editors.length == 0 ? (
        <p className="text-xl mt-20 text-center text-gray-600">
          No editors are currently available. <br />
          You can start by adding a new editor using the button above.
        </p>
      ) : (
        <>
        <button
        className="btn btn-primary w-36 self-center"
        onClick={async () => {
          await fetchUsers();
          (
            document.getElementById("users_modal") as HTMLDialogElement
          )?.showModal();
        }}
      >
        Add editor
      </button>
        <table className="w-full md:w-3/4 mx-auto table table-sm md:table-lg  table-zebra ">
          
          <thead>
            <tr className="text-lg md:text-xl text-black dark:text-white text-center">
              <th className="hidden md:table-cell"></th>
              <th>Name</th>
              <th className="hidden md:table-cell">Email</th>
              <th className="hidden md:table-cell">Date created</th>
              <th>Authorization</th>
              <td>Remove editor</td>
            </tr>
          </thead>
          <tbody>
            {editors.map((user, index) => (
              <tr className="hover text-lg md:text-xl text-center" key={user.id}>
                <th className="hidden md:table-cell">{index + 1}</th>
                <td>{user.name}</td>
                <td className="hidden md:table-cell">{user.email}</td>
                <td className="hidden md:table-cell">{user.createdAt.split("T")[0]}</td>
                <td>{user.isAuthorized ? "Authorized" : "Unauthorized"}</td>
                <td>
                  <button
                    className="btn btn-outline btn-error"
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
  );
}
