import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import {
  authorizeUser,
  logout,
  revokeUser,
} from "../../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

interface user {
  id: string;
  email: string;
  name: string;
  role: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ShowUsersModal() {
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState<user[]>([]);

  async function fetchUsers() {
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
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeEditor = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/makeEditor/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(authorizeUser());
        fetchUsers();
      } else {
        throw new Error("Forbidden");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <dialog id="users_modal" className="modal">
      <div className="modal-box">
        <div className="overflow-x-auto">
          <p className="text-center font-bold text-2xl mb-5">Users list</p>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <td>Make editor</td>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <th>{index + 1}</th> <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleMakeEditor(user.id)}
                    >
                      Make editor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn btn-error"
            onClick={() => {
              (
                document.getElementById("users_modal") as HTMLDialogElement
              )?.close();
            }}
          >
            close
          </button>
        </div>
      </div>
    </dialog>
  );
}
