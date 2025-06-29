import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { selectLoggedInUser, selectUserChecked, checkAuthAsync } from '../UserLogin/authSlice';

function Protected({ children }) {
  const dispatch = useDispatch();
  const userChecked = useSelector(selectUserChecked);
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    // Check authentication when accessing protected routes
    if (!user) {
      dispatch(checkAuthAsync());
    }
  }, [dispatch, user]);

  if (userChecked && !user) {
    return <Navigate to="/userlogin" replace={true}></Navigate>;
  }
  return children;
}

export default Protected;