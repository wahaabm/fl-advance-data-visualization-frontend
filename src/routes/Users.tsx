import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { authorizeUser, logout, revokeUser } from "../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/Loading";
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
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <div className="text-5xl font-bold mt-2 text-center">Users dashboard</div>
      <table className="table table-zebra mt-5">
        <thead>
          <tr className="text-xl">
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Date created</th>
            <th>Authorization</th>
            <td>Allow/Revoke</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr className="text-lg" key={user.id}>
              <th>{index + 1}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.createdAt.split("T")[0]}</td>
              <td>{user.isAuthorized ? "Authorized" : "Unauthorized"}</td>
              <td>
                <button
                  className={
                    user.isAuthorized
                      ? "btn btn-outline btn-error"
                      : "btn btn-outline btn-success"
                  }
                  onClick={() =>
                    user.isAuthorized
                      ? handleRevoke(user.id)
                      : handleAuthorize(user.id)
                  }
                >
                  {user.isAuthorized ? "Revoke access" : "Allow access"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
