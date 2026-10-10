import { render, waitFor } from '@testing-library/react';
import {
  getClerkAccessToken,
  getClerkSupabaseToken,
  setClerkSessionTokenGetter,
  setClerkTokenGetter,
} from '../lib/supabaseClient';

const mockGetToken = jest.fn();
let ClerkAuthProvider;

jest.mock('@clerk/react', () => {
  const React = require('react');
  return {
    ClerkProvider: ({ children }) => children,
    useAuth: () => ({
      getToken: mockGetToken,
      isLoaded: true,
      isSignedIn: true,
      signOut: jest.fn(),
    }),
    useSignIn: () => ({ signIn: null }),
    useSignUp: () => ({ signUp: null }),
    useUser: () => ({ user: null }),
  };
});

jest.mock('../lib/supabaseClient', () => ({
  getClerkAccessToken: jest.fn(),
  getClerkSupabaseToken: jest.fn(),
  setClerkTokenGetter: jest.fn(),
  setClerkSessionTokenGetter: jest.fn(),
}));

beforeAll(() => {
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY = 'pk_test_test';
  ({ ClerkAuthProvider } = require('./ClerkAuthProvider'));
});

beforeEach(() => {
  jest.clearAllMocks();
  mockGetToken.mockResolvedValue('supabase-template-token');
});

test('uses the Clerk Supabase JWT template for Supabase access tokens', async () => {
  render(
    <ClerkAuthProvider>
      <p>Learn Hub</p>
    </ClerkAuthProvider>,
  );

  await waitFor(() => expect(setClerkTokenGetter).toHaveBeenCalledWith(expect.any(Function)));
  const getSupabaseToken = setClerkTokenGetter.mock.calls
    .map(([getter]) => getter)
    .find((getter) => typeof getter === 'function');

  await expect(getSupabaseToken()).resolves.toBe('supabase-template-token');
  expect(mockGetToken).toHaveBeenCalledWith({ template: 'supabase' });
});

test('keeps the regular Clerk session token for backend authentication', async () => {
  render(
    <ClerkAuthProvider>
      <p>Learn Hub</p>
    </ClerkAuthProvider>,
  );

  await waitFor(() => expect(setClerkSessionTokenGetter).toHaveBeenCalledWith(expect.any(Function)));
  const getSessionToken = setClerkSessionTokenGetter.mock.calls
    .map(([getter]) => getter)
    .find((getter) => typeof getter === 'function');

  await expect(getSessionToken()).resolves.toBe('supabase-template-token');
  expect(mockGetToken).toHaveBeenCalledWith();
});

test('uses the Supabase-template token for assistant requests', async () => {
  render(
    <ClerkAuthProvider>
      <p>Learn Hub</p>
    </ClerkAuthProvider>,
  );

  await waitFor(() => expect(setClerkTokenGetter).toHaveBeenCalledWith(expect.any(Function)));
  const getSupabaseToken = setClerkTokenGetter.mock.calls
    .map(([getter]) => getter)
    .find((getter) => typeof getter === 'function');
  getClerkSupabaseToken.mockImplementation(getSupabaseToken);

  await expect(getClerkSupabaseToken()).resolves.toBe('supabase-template-token');
  expect(getClerkAccessToken).not.toHaveBeenCalled();
  expect(mockGetToken).toHaveBeenCalledWith({ template: 'supabase' });
});
