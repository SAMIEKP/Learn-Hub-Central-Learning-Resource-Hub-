import { useEffect, useMemo, useState } from 'react';
import { useLearnHubAuth } from '../auth/ClerkAuthProvider';
import { loadOrCreateProfile } from '../api/profiles';

export function useAuth() {
  const auth = useLearnHubAuth();
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const appUser = useMemo(() => auth.user ? {
    id: auth.user.id,
    name: profile?.full_name || auth.user.fullName || 'LearnHub Student',
    email: auth.user.primaryEmailAddress?.emailAddress || '',
    role: profile?.role || 'student',
    school: profile?.school || 'Not specified',
    form: profile?.form || '',
    department: profile?.department || '',
    phone: profile?.phone || '',
  } : null, [auth.user, profile]);

  useEffect(() => {
    let isActive = true;
    if (!auth.isLoaded || !auth.isSignedIn || !auth.user) {
      setProfile(null);
      setIsProfileLoading(false);
      return undefined;
    }

    setIsProfileLoading(true);
    loadOrCreateProfile(auth.user)
      .then((value) => {
        if (isActive) setProfile(value);
      })
      .catch((error) => {
        console.error('Unable to load the LearnHub profile:', error);
        if (isActive) setProfile(null);
      })
      .finally(() => {
        if (isActive) setIsProfileLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [auth.isLoaded, auth.isSignedIn, auth.user]);

  return {
    ...auth,
    profile,
    appUser,
    isLoading: !auth.isLoaded || isProfileLoading,
    isConfigured: auth.isConfigured,
    session: auth.isSignedIn && auth.user ? { user: auth.user } : null,
  };
}

export default useAuth;
