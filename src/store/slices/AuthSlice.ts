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
  currentUser: string | null;
  loading: boolean;
}

const initialState: authState = {
  isAuthorized: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")!).isAuthorized
    : false,
  isLoggedIn: false,
  role: localStorage.getItem("token")
    ? (jwtDecode(localStorage.getItem("token")!).role as UserRole)
    : UserRole.NONE,
  currentUser: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLoggedinState: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload);
      state.currentUser = jwtDecode(action.payload).email;
      state.role = jwtDecode(action.payload).role as UserRole;
      state.isAuthorized = jwtDecode(action.payload).isAuthorized;
    },
    logout: (state) => {
      console.log("here");
      state.isLoggedIn = false;
      localStorage.clear();
      state.currentUser = null;
      state.role = UserRole.USER;
      state.isAuthorized = false;
    },
    authorizeUser: (state) => {
      state.isAuthorized = true;
    },
    revokeUser: (state) => {
      state.isAuthorized = false;
    },
  },
});

export const { updateLoggedinState, logout, authorizeUser, revokeUser } =
  authSlice.actions;

export default authSlice.reducer;
