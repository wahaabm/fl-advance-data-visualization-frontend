// App.tsx
import React from "react";
import Signin from "./components/Signin";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

const App: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  console.log(isAdmin);
  return (
    <>
      {isLoggedIn ? (
        isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )
      ) : (
        <Signin />
      )}
    </>
  );
};

export default App;
