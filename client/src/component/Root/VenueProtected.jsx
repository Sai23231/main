import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { selectLoggedInUser, selectUserChecked, checkAuthAsync } from '../UserLogin/authSlice';

function VenueProtected({ children }) {
  const dispatch = useDispatch();
  const userChecked = useSelector(selectUserChecked);
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    // Check authentication when accessing protected routes
    if (!user) {
      dispatch(checkAuthAsync());
    }
  }, [dispatch, user]);

  // Check if user is authenticated and is a venue
  if (userChecked && (!user || user.role !== 'venue')) {
    return <Navigate to="/venue-login" replace={true}></Navigate>;
  }

  return children;
}

export default VenueProtected; 