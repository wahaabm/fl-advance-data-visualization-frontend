import { Outlet, Navigate } from 'react-router';

const PrivateRoutes = () => {
  return localStorage.getItem('token') ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
