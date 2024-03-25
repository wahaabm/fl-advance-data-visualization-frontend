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

  async function fetchEditors() {
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
    }
  }

  useEffect(() => {
    fetchEditors();
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
        fetchEditors();
      } else if (res.status == 403) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
      navigate("/login");
    }
  };

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

  return (
    <div className="">
      <ShowUsersModal />

      <button
        className="btn btn-neutral w-36 mt-5"
        onClick={() => {
          (
            document.getElementById("users_modal") as HTMLDialogElement
          )?.showModal();
        }}
      >
        Add editor
      </button>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Date created</th>
            <td>Revoke status</td>
          </tr>
        </thead>
        <tbody>
          {editors.map((user, index) => (
            <tr key={user.id}>
              <th>{index + 1}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.createdAt.split("T")[0]}</td>
              <td>
                <button
                  className="btn btn-sm"
                  onClick={() => handleRemoveEditor(user.id)}
                >
                  Remove editor
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
