import axios from 'axios';
import { askLearnHubAssistant } from './client';
import { supabase } from '../lib/supabaseClient';

jest.mock('axios', () => ({
  __esModule: true,
  default: { create: jest.fn(() => ({ get: jest.fn(), post: jest.fn() })) },
}));

jest.mock('../lib/supabaseClient', () => ({
  supabase: { auth: { getSession: jest.fn() } },
}));

const assistantClient = axios.create.mock.results[1].value;

beforeEach(() => {
  assistantClient.post.mockReset();
  supabase.auth.getSession.mockReset();
});

test('sends the current Supabase access token to the authenticated assistant endpoint', async () => {
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { access_token: 'student-token' } },
    error: null,
  });
  assistantClient.post.mockResolvedValue({ data: { answer: 'Answer', sources: [] } });

  await askLearnHubAssistant({ question: 'Explain cells' });

  expect(assistantClient.post).toHaveBeenCalledWith(
    '/assistant/chat',
    { question: 'Explain cells' },
    expect.objectContaining({
      headers: { Authorization: 'Bearer student-token' },
      timeout: 30000,
    }),
  );
});

test('does not call the assistant when there is no signed-in Supabase session', async () => {
  supabase.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });

  await expect(askLearnHubAssistant({ question: 'Explain cells' }))
    .rejects.toThrow(/sign in/i);
  expect(assistantClient.post).not.toHaveBeenCalled();
});
