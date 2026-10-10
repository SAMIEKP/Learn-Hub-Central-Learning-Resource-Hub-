// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('@clerk/react', () => {
  const React = require('react');
  return {
    ClerkProvider: ({ children }) => children,
    UserProfile: () => React.createElement('div', { 'data-testid': 'clerk-user-profile' }),
    useAuth: () => ({
      getToken: jest.fn().mockResolvedValue(null),
      isLoaded: true,
      isSignedIn: false,
      signOut: jest.fn(),
    }),
    useSignIn: () => ({ signIn: null }),
    useSignUp: () => ({ signUp: null }),
    useUser: () => ({ user: null }),
  };
});
