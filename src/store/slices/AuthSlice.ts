import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

enum UserRole {
  ADMIN = "ADMIN_USER",
  EDITOR = "EDITOR_USER",
  USER = "NORMAL_USER",
  NONE = "NONE",
}

interface authState {
  isLoggedIn: boolean;
  isAuthorized: boolean;
  role: UserRole;
  userId: string | null;
}

const initialState: authState = {
  isAuthorized: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")!).isAuthorized
    : false,
  isLoggedIn: false,
  role: localStorage.getItem("token")
    ? (jwtDecode(localStorage.getItem("token")!).role as UserRole)
    : UserRole.NONE,
  userId: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")!).id
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLoggedinState: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload);
      state.role = jwtDecode(action.payload).role as UserRole;
      state.isAuthorized = jwtDecode(action.payload).isAuthorized;
      state.userId = jwtDecode(action.payload).id;
    },
    logout: (state) => {
      console.log("here");
      state.isLoggedIn = false;
      localStorage.clear();
      state.role = UserRole.USER;
      state.isAuthorized = false;
      state.userId = null;
    },
    authorizeUser: (state) => {
      state.isAuthorized = true;
    },
    revokeUser: (state) => {
      state.isAuthorized = false;
    },
    makeEditor: (state) => {
      state.isAuthorized = true;
    },
    removeEditor: (state) => {
      state.isAuthorized = false;
    },
  },
});

export const { updateLoggedinState, logout, authorizeUser, revokeUser } =
  authSlice.actions;

export default authSlice.reducer;
