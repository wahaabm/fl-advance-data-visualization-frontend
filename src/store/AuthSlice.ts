import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface authState {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const initialState: authState = {
  isLoggedIn: false,
  isAdmin: false,
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
