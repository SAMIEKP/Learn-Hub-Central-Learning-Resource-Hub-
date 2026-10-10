import { createContext, useContext, useEffect, useMemo } from 'react';
import { ClerkProvider, useAuth, useSignIn, useSignUp, useUser } from '@clerk/react';
import { setClerkTokenGetter } from '../lib/supabaseClient';

const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const unavailableAuth = {
  isConfigured: Boolean(clerkPublishableKey),
  isLoaded: !clerkPublishableKey,
  isSignedIn: false,
  user: null,
  getToken: async () => null,
  signOut: async () => {},
};

const AuthContext = createContext(unavailableAuth);

function ClerkAuthBridge({ children }) {
  const { getToken, isLoaded, isSignedIn, signOut } = useAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { user } = useUser();

  useEffect(() => {
    setClerkTokenGetter(isSignedIn ? () => getToken() : null);
    return () => setClerkTokenGetter(null);
  }, [getToken, isSignedIn]);

  const value = useMemo(() => ({
    isConfigured: true,
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    user: user || null,
    getToken,
    signOut,
    signIn,
    signUp,
  }), [getToken, isLoaded, isSignedIn, signIn, signOut, signUp, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function ClerkAuthProvider({ children }) {
  if (!clerkPublishableKey) {
    return <AuthContext.Provider value={unavailableAuth}>{children}</AuthContext.Provider>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ClerkAuthBridge>{children}</ClerkAuthBridge>
    </ClerkProvider>
  );
}

export function useLearnHubAuth() {
  return useContext(AuthContext);
}
