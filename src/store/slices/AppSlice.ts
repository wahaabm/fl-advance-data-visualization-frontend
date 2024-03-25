import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";

interface appState {
  users: [];
  editors: [];
}

const initialState: appState = {
  users: [],
  editors: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUsers: (state, action) => {},
    setEditors: (state, action) => {},
  },
});

export const { setUsers, setEditors } = appSlice.actions;
export default appSlice.reducer;
