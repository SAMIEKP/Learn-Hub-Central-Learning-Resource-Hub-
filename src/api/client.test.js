import axios from 'axios';
import { askLearnHubAssistant } from './client';
import { getClerkAccessToken } from '../lib/supabaseClient';

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
  getClerkAccessToken: jest.fn(),
  supabase: {},
}));

const assistantClient = axios.create.mock.results[1].value;

beforeEach(() => {
  assistantClient.post.mockReset();
  getClerkAccessToken.mockReset();
});

test('sends the current Clerk session token to the authenticated assistant endpoint', async () => {
  getClerkAccessToken.mockResolvedValue('clerk-session-token');
  assistantClient.post.mockResolvedValue({ data: { answer: 'Answer', sources: [] } });

  await askLearnHubAssistant({ question: 'Explain cells' });

  expect(assistantClient.post).toHaveBeenCalledWith(
    '/assistant/chat',
    { question: 'Explain cells' },
    expect.objectContaining({
      headers: { Authorization: 'Bearer clerk-session-token' },
      timeout: 30000,
    }),
  );
});

test('does not call the assistant when there is no signed-in Clerk session', async () => {
  getClerkAccessToken.mockResolvedValue(null);

  await expect(askLearnHubAssistant({ question: 'Explain cells' }))
    .rejects.toThrow(/sign in/i);
  expect(assistantClient.post).not.toHaveBeenCalled();
});
