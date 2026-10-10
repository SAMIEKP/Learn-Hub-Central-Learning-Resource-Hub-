import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/useAppStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppStore();
  const { isLoading, isConfigured, isSignedIn, appUser } = useAuth();
  const login = useAppStore((state) => state.login);

  useEffect(() => {
    if (isSignedIn && appUser) login(appUser);
  }, [appUser, isSignedIn, login]);

  if (isConfigured && (isLoading || (isSignedIn && !isAuthenticated))) {
    return <main className="auth-session-loading" role="status">Checking your session…</main>;
  }

  if (isConfigured && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isConfigured) return <Navigate to="/login" replace />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
