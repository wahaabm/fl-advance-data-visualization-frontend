import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
interface ExtendedJwtPayload extends JwtPayload {
  isAuthorized: boolean;
  role: string;
  id: string;
}

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
    ? (jwtDecode(localStorage.getItem("token")!) as ExtendedJwtPayload)
        .isAuthorized
    : false,
  isLoggedIn: false,
  role: localStorage.getItem("token")
    ? ((jwtDecode(localStorage.getItem("token")!) as ExtendedJwtPayload)
        .role as UserRole)
    : UserRole.NONE,
  userId: localStorage.getItem("token")
    ? (jwtDecode(localStorage.getItem("token")!) as ExtendedJwtPayload).id
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLoggedinState: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload);
      state.role = (jwtDecode(action.payload) as ExtendedJwtPayload)
        .role as UserRole;
      state.isAuthorized = (
        jwtDecode(action.payload) as ExtendedJwtPayload
      ).isAuthorized;
      state.userId = (jwtDecode(action.payload) as ExtendedJwtPayload).id;
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
