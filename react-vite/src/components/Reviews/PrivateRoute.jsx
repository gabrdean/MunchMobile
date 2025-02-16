import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// A wrapper component for protected routes
const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.session.user);

  // If the user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is logged in, allow access to the route
  return children;
};

export default PrivateRoute;
