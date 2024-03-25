import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { authorizeUser, logout, revokeUser } from "../store/slices/AuthSlice";
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

export default function ShowUsers() {
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
      setUsers(usersData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAuthorize = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/allowUser/${id}`, {
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

  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/revokeUser/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(revokeUser());
        fetchUsers();
      } else {
        throw new Error("Forbidden");
      }
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Date created</th>
            <th>Auhtorization</th>
            <td>Allow/Revoke</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <th>{index + 1}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.createdAt.split("T")[0]}</td>
              <td>{user.isAuthorized ? "Authorized" : "Unauthorized"}</td>
              <td>
                <button
                  className="btn btn-sm"
                  onClick={() =>
                    user.isAuthorized
                      ? handleRevoke(user.id)
                      : handleAuthorize(user.id)
                  }
                >
                  {user.isAuthorized ? "Revoke" : "Allow"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
