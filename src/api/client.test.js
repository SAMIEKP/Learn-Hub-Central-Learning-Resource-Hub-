import axios from 'axios';
import { askLearnHubAssistant } from './client';
import { getSupabaseSessionToken } from '../lib/supabaseClient';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
    })),
  },
}));

jest.mock('../lib/supabaseClient', () => ({
  getSupabaseSessionToken: jest.fn(),
  supabase: {},
}));

const assistantClient = axios.create.mock.results[1].value;

beforeEach(() => {
  assistantClient.post.mockReset();
  getSupabaseSessionToken.mockReset();
});

test('sends the current Supabase session token to the assistant endpoint', async () => {
  getSupabaseSessionToken.mockResolvedValue('supabase-session-token');
  assistantClient.post.mockResolvedValue({ data: { answer: 'Answer', sources: [] } });

  await askLearnHubAssistant({ question: 'Explain cells' });

  expect(assistantClient.post).toHaveBeenCalledWith(
    '/assistant/chat',
    { question: 'Explain cells' },
    expect.objectContaining({
      headers: { Authorization: 'Bearer supabase-session-token' },
      timeout: 30000,
    }),
  );
});

test('does not call the assistant when there is no signed-in Supabase session', async () => {
  getSupabaseSessionToken.mockResolvedValue(null);

  await expect(askLearnHubAssistant({ question: 'Explain cells' }))
    .rejects.toThrow(/sign in/i);
  expect(assistantClient.post).not.toHaveBeenCalled();
});
