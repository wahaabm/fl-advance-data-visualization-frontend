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

export default function ShowUsersModal({ fetchEditors, fetchUsers, users }) {
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    } finally {
      fetchEditors();
    }
  };

  return (
    <dialog id="users_modal" className="modal">
      <div className="modal-box">
        <div className="overflow-x-auto">
          <p className="font-bold text-2xl text-center">Users list</p>
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
                      className="btn btn-outline btn-success btn-sm"
                      onClick={() => handleMakeEditor(user.id)}
                    >
                      Make editor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button
              className="btn btn-outline btn-error"
              onClick={() => {
                (
                  document.getElementById("users_modal") as HTMLDialogElement
                )?.close();
              }}
            >
              close
            </button>
          </table>
        </div>
      </div>
    </dialog>
  );
}
