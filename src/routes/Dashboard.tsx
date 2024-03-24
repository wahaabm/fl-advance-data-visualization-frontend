import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { logout } from "../store/slices/AuthSlice";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div className="flex flex-col mx-auto w-11/12">
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
        </div>
        <div className="gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
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
                <a>Settings</a>
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
      <div>
        <Outlet />
      </div>
    </div>
  );
}
