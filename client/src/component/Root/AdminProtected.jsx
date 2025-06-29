import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectAdminUser, selectUserChecked } from '../UserLogin/authSlice';

function AdminProtected({ children }) {
  const userChecked = useSelector(selectUserChecked);
  const adminUser = useSelector(selectAdminUser);

  if (userChecked && !adminUser) {
    return <Navigate to="/admin/login" replace={true} />;
  }

  return children;
}

export default AdminProtected; 