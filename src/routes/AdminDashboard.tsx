import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { logout } from "../store/slices/AuthSlice";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
 const navigate = useNavigate();
  return (
    <>
      <div>Hello admin!</div>
      <button
        onClick={() => {
          dispatch(logout());
          navigate("/login")
        }}
      >
        logout
      </button>
    </>
  );
}
