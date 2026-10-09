import { useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

export default function AuthPage() {
  const location = useLocation();

  return location.pathname === '/register' ? <Register /> : <Login />;
}
