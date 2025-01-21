import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JwtPayload, jwtDecode } from 'jwt-decode';
interface ExtendedJwtPayload extends JwtPayload {
  isAuthorized: boolean;
  role: string;
  id: string;
  name: string;
}

enum UserRole {
  ADMIN = 'ADMIN_USER',
  EDITOR = 'EDITOR_USER',
  USER = 'NORMAL_USER',
  NONE = 'NONE',
}

interface authState {
  isLoggedIn: boolean;
  isAuthorized: boolean;
  role: UserRole;
  userId: string | null;
  userName: string;
}

const token = localStorage.getItem('token');
const decodedToken = token ? jwtDecode<ExtendedJwtPayload>(token) : null;

const initialState: authState = {
  isLoggedIn: !!token,
  isAuthorized: decodedToken ? decodedToken.isAuthorized : false,
  role: decodedToken ? (decodedToken.role as UserRole) : UserRole.NONE,
  userId: decodedToken ? decodedToken.id : null,
  userName: decodedToken ? decodedToken.name : '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateLoggedinState: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      localStorage.setItem('token', action.payload);
      state.role = (jwtDecode(action.payload) as ExtendedJwtPayload)
        .role as UserRole;
      state.isAuthorized = (
        jwtDecode(action.payload) as ExtendedJwtPayload
      ).isAuthorized;
      state.userId = (jwtDecode(action.payload) as ExtendedJwtPayload).id;
      state.userName = (jwtDecode(action.payload) as ExtendedJwtPayload).name;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('token');
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
