import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { authorizeUser, revokeUser } from "../store/slices/AuthSlice";

interface user {
  id: string;
  email: string;
  name: string;
  role: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MyComponent() {
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<user[]>([]);
  ///allowUser/:userId

  async function fetchUsers() {
    if (!token) {
      return; // or handle the lack of token in some other way
    }

    try {
      const response = await fetch("http://localhost:3000/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
      // You may also choose to set an error state here if needed
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

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
        {/* head */}
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
              <th>{index + 1}</th> {/* Adjusting the index to start from 2 */}
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
