import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { logout } from "../store/slices/AuthSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [displayMode, setDisplayMode] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp! < currentTime) {
        console.log("Token is expired");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [token, navigate]);

  return (
    <div className="container mx-auto bg-base-200 p-10">
      <div className="flex mx-auto justify-between navbar border-b-2 border-white p-0">
        <div className="flex flex-col justify-center">
          <img src="/finallogo.svg" alt="Macrobourse Logo" width={200} />
          <div className="text-2xl">Macrobourse</div>
        </div>
        <div className="flex flex-col">
          <div className="text-5xl font-bold mt-2 text-center">{title}</div>
          <p className="text-left mt-2 text-lg">{description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="dropdown dropdown-end self-end">
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
          <div>
            <label className="form-control w-80">
              {/* <div className="label">
                <p className="label-text">Key categories</p>
              </div> */}
              <select className="select select-bordered">
                <option
                  onClick={() => {
                    setTitle("Articles dashboard");
                    setDescription("Manage and view all articles at a glance.");
                    navigate("articles");
                  }}
                >
                  Articles
                </option>
                <option
                  selected
                  onClick={() => {
                    setTitle("Charts dashboard");
                    setDescription(
                      "Manage and visualize data and insights through interactive charts."
                    );
                    navigate("charts");
                  }}
                >
                  Charts
                </option>
                {(role === "ADMIN_USER" || role === "EDITOR_USER") && (
                  <option
                    onClick={() => {
                      setTitle("Users dashboard");
                      navigate("users");
                      setDescription(
                        "Monitor and manage user authorization and profiles."
                      );
                    }}
                  >
                    Users
                  </option>
                )}
                {role === "ADMIN_USER" && (
                  <option
                    onClick={() => {
                      setTitle("Editors dashboard");
                      setDescription(
                        "Grant or revoke editor rights for users with ease."
                      );
                      navigate("editors");
                    }}
                  >
                    Editors
                  </option>
                )}
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-6 h-full">
        <Outlet context={[displayMode, setTitle, setDescription]} />
      </div>
    </div>
  );
}
