import { render, waitFor } from '@testing-library/react';
import { getSupabaseSessionToken } from '../lib/supabaseClient';

let SupabaseAuthProvider;

jest.mock('../lib/supabaseClient', () => ({
  getSupabaseSessionToken: jest.fn(),
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

beforeAll(() => {
  ({ SupabaseAuthProvider } = require('./SupabaseAuthProvider'));
});

beforeEach(() => {
  jest.clearAllMocks();
  getSupabaseSessionToken.mockResolvedValue('supabase-session-token');
});

test('provides Supabase session token', async () => {
  render(
    <SupabaseAuthProvider>
      <p>Learn Hub</p>
    </SupabaseAuthProvider>,
  );

  await waitFor(() => expect(getSupabaseSessionToken).toHaveBeenCalled());
});
