import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { logout } from "../store/slices/AuthSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const [displayMode, setDisplayMode] = useState(true);
  const token = localStorage.getItem("token");

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      console.log("here");
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (parseInt(decodedToken.exp) < currentTime) {
        console.log("Token is expired");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex mx-auto justify-between navbar bg-base-300">
        <div>
          <div className="flex-1">
            <a
              className="btn btn-ghost text-xl"
              onClick={() => {
                navigate("articles");
              }}
            >
              Articles
            </a>
          </div>
          <div className="flex-1">
            <a
              className="btn btn-ghost text-xl"
              onClick={() => {
                navigate("charts");
              }}
            >
              Charts
            </a>
          </div>
          {(role === "ADMIN_USER" || role === "EDITOR_USER") && (
            <div className="flex-1">
              <a
                className="btn btn-ghost text-xl"
                onClick={() => navigate("users")}
              >
                Users
              </a>
            </div>
          )}
          {role === "ADMIN_USER" && (
            <div className="flex-1">
              <a
                className="btn btn-ghost text-xl"
                onClick={() => navigate("editors")}
              >
                Editors
              </a>
            </div>
          )}
        </div>
        <div className="gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <label className="label cursor-pointer">
                  <span className="label-text">Dark mode</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    onChange={() => {
                      setDisplayMode((prev) => !prev);
                      document.documentElement.setAttribute(
                        "data-theme",
                        `${displayMode == true ? "dark" : "light"}`
                      );
                    }}
                    checked={!displayMode}
                  />
                </label>
              </li>
              <li>
                <a type="button" onClick={handleSignOut}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
