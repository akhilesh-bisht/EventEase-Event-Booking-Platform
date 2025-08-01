import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('eventease_token');
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;