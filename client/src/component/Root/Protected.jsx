import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser, selectUserChecked } from '../UserLogin/authSlice';

function Protected({ children }) {
  const userChecked = useSelector(selectUserChecked);
  const user = useSelector(selectLoggedInUser);

  if (userChecked && !user) {
    return <Navigate to="/userlogin" replace={true}></Navigate>;
  }
  return children;
}

export default Protected;