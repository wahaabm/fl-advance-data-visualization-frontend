//TODO: Add editors here.
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import {
  authorizeUser,
  logout,
  revokeUser,
} from "../../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
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

  async function fetchEditors() {
    setLoading(true);
    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/admin/editors", {
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
    setLoading(true);
    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/admin/users", {
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
        (user) => user.role === "NORMAL_USER"
      );

      setUsers(normalUsers);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEditors();
  }, [token]);

  const handleRemoveEditor = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/admin/removeEditor/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    <div className="flex flex-col overflow-x-auto">
      <ShowUsersModal
        fetchEditors={fetchEditors}
        fetchUsers={fetchUsers}
        users={users}
      />
      <div className="text-5xl font-bold mt-2 text-center">
        Editors dashboard
      </div>
      <p className="text-center mt-2 text-lg">
        Grant or revoke editor rights for users with ease.
      </p>
      <button
        className="btn btn-primary w-36 mt-5 mb-5 mx-auto"
        onClick={async () => {
          await fetchUsers();
          (
            document.getElementById("users_modal") as HTMLDialogElement
          )?.showModal();
        }}
      >
        Add editor
      </button>
      {editors.length == 0 ? (
        <p className="text-xl mt-20 text-center text-gray-600">
          No editors are currently available. <br />
          You can start by adding a new editor using the button above.
        </p>
      ) : (
        <table className="table table-zebra">
          <thead>
            <tr className="text-xl">
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Date created</th>
              <th>Authorization</th>
              <td>Revoke</td>
            </tr>
          </thead>
          <tbody>
            {editors.map((user, index) => (
              <tr className="text-lg" key={user.id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.createdAt.split("T")[0]}</td>
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
      )}
    </div>
  );
}
