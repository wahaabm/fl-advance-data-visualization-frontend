import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";

export default function HomePage() {
  const isAuthorized = useAppSelector((state) => state.auth.isAuthorized);
  const isLoggedin = useAppSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();
  if (!isLoggedin) {
    navigate("/login");
  }
  return (
    <div>
      {isAuthorized ? <div>hello world</div> : <div>Sorry not authorized</div>}
    </div>
  );
}
