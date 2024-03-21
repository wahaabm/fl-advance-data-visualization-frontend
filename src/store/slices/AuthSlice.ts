import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

enum UserRole {
  ADMIN = "ADMIN_USER",
  EDITOR = "EDITOR_USER",
  USER = "NORMAL_USER",
}

interface authState {
  isLoggedIn: boolean;
  isAuthorized : boolean;
  role: UserRole;
  currentUser: string | null;
  loading: boolean;
}

const initialState: authState = {
  isAuthorized: false,
  isLoggedIn: false,
  role: UserRole.USER,
  currentUser: null,
  loading: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLoggedinState: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      localStorage.setItem("token",action.payload)
      state.currentUser= (jwtDecode(action.payload).email)
      state.role = (jwtDecode(action.payload).role) as UserRole
    },
    logout: (state) => {
      console.log("here")
      state.isLoggedIn = false;
      localStorage.removeItem("token");
      state.currentUser = null;
      state.role = UserRole.USER;
      state.isAuthorized = false;
    },
  },
});

export const { updateLoggedinState, logout } = authSlice.actions;

export default authSlice.reducer;
