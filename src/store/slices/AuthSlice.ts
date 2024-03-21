import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface authState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  currentUser: string | null;
  loading: boolean;
}

const initialState: authState = {
  isLoggedIn: false,
  isAdmin: false,
  currentUser: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = true;
      state.isAdmin = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
