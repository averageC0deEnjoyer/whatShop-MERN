import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  //check if user admin
  const userAdminStatus = useSelector(
    (store) => store?.auth?.userInfo?.isAdmin
  );

  return userAdminStatus ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
