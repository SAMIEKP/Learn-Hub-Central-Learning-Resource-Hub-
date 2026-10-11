import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const unavailableAuth = {
  isConfigured: false,
  isLoaded: true,
  isSignedIn: false,
  user: null,
  getToken: async () => null,
  signOut: async () => {},
  signIn: null,
  signUp: null,
};

const AuthContext = createContext(unavailableAuth);

export function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (isActive) {
        setSession(session);
        setIsLoading(false);
      }
    }

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isActive) {
        setSession(session);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    if (!supabase) {
      return unavailableAuth;
    }

    return {
      isConfigured: true,
      isLoaded: !isLoading,
      isSignedIn: Boolean(session?.user),
      user: session?.user || null,
      getToken: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
      signIn: {
        password: async ({ identifier, password }) => {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password,
          });
          if (error) return { error };
          return { data, status: 'complete' };
        },
        create: async ({ identifier }) => {
          return { error: null };
        },
        resetPasswordEmailCode: {
          sendCode: async () => {
            const { error } = await supabase.auth.resetPasswordForEmail(identifier);
            return { error };
          },
          verifyCode: async ({ code }) => {
            return { error: new Error('Email verification not implemented') };
          },
          submitPassword: async ({ password }) => {
            const { error } = await supabase.auth.updateUser({ password });
            return { error };
          },
        },
        sso: async ({ strategy, redirectUrl, redirectCallbackUrl }) => {
          const provider = strategy.replace('oauth_', '');
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: redirectCallbackUrl || redirectUrl,
            },
          });
          if (error) return { error };
          return { data };
        },
      },
      signUp: {
        password: async ({ emailAddress, password, firstName, lastName }) => {
          const { data, error } = await supabase.auth.signUp({
            email: emailAddress,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`.trim(),
              },
            },
          });
          if (error) return { error };
          return { data, status: data.session ? 'complete' : 'missing_verification' };
        },
        verifications: {
          sendEmailCode: async () => {
            return { error: null };
          },
          verifyEmailCode: async ({ code }) => {
            const { error } = await supabase.auth.verifyOtp({
              email: session?.user?.email,
              token: code,
              type: 'email',
            });
            return { error };
          },
        },
        sso: async ({ strategy, redirectUrl, redirectCallbackUrl }) => {
          const provider = strategy.replace('oauth_', '');
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: redirectCallbackUrl || redirectUrl,
            },
          });
          if (error) return { error };
          return { data };
        },
        finalize: async () => {
          return;
        },
      },
    };
  }, [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useLearnHubAuth() {
  return useContext(AuthContext);
}
