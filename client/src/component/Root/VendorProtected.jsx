import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { selectLoggedInUser, selectUserChecked, checkVendorAuthAsync } from '../UserLogin/authSlice';

function VendorProtected({ children }) {
  const dispatch = useDispatch();
  const userChecked = useSelector(selectUserChecked);
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    // Check vendor authentication when accessing protected routes
    if (!user || user.role !== 'vendor') {
      dispatch(checkVendorAuthAsync());
    }
  }, [dispatch, user]);

  // Check if user is authenticated and is a vendor
  if (userChecked && (!user || user.role !== 'vendor')) {
    return <Navigate to="/vendorlogin" replace={true}></Navigate>;
  }

  return children;
}

export default VendorProtected; 