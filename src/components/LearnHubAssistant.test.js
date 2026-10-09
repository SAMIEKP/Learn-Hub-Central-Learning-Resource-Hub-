import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LearnHubAssistant from './LearnHubAssistant';
import { askLearnHubAssistant } from '../api/client';

jest.mock('../api/client', () => ({
  askLearnHubAssistant: jest.fn(),
}));

beforeEach(() => {
  askLearnHubAssistant.mockReset();
});

test('opens with a greeting and keeps sending disabled for an empty question', () => {
  render(<LearnHubAssistant currentPage="home" onOpenResource={jest.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: /ask learnhub/i }));

  expect(screen.getByRole('dialog', { name: /learnhub assistant chat/i })).toBeInTheDocument();
  expect(screen.getByText(/hi! i’m the learnhub assistant/i)).toBeInTheDocument();
  expect(screen.getByAltText('Learn Hub assistant')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /explain a difficult topic/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /send question/i })).toBeDisabled();
});

test('shows a loading status and disables input while waiting for the answer', async () => {
  let resolveAnswer;
  askLearnHubAssistant.mockImplementation(() => new Promise((resolve) => {
    resolveAnswer = resolve;
  }));
  render(<LearnHubAssistant currentPage="home" onOpenResource={jest.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: /ask learnhub/i }));
  const input = screen.getByRole('textbox', { name: /ask a question/i });
  fireEvent.change(input, { target: { value: 'Explain photosynthesis' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  expect(screen.getByRole('status')).toHaveTextContent(/preparing an answer/i);
  expect(input).toBeDisabled();
  expect(screen.getByRole('button', { name: /send question/i })).toBeDisabled();

  resolveAnswer({ answer: 'Plants use light to make food. [1]', sources: [] });
  await screen.findByText(/plants use light to make food/i);
});

test('sends a question with resource context and opens returned citations', async () => {
  const onOpenResource = jest.fn();
  askLearnHubAssistant.mockResolvedValue({
    answer: 'The cell membrane controls what enters and leaves the cell. [1]',
    sources: [{
      resource_id: 'verified-resource-1',
      title: 'Cell Structure Notes',
      subject: 'Biology',
      topic: 'Cells',
    }],
  });
  render(
    <LearnHubAssistant
      currentPage="resource"
      resource={{
        id: 'current-resource',
        title: 'Cell Biology',
        meta: 'Biology · Cells',
        resourceType: 'book',
      }}
      onOpenResource={onOpenResource}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: /ask learnhub/i }));
  const input = screen.getByRole('textbox', { name: /ask a question/i });
  fireEvent.change(input, { target: { value: 'What does the cell membrane do?' } });
  fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
  expect(askLearnHubAssistant).not.toHaveBeenCalled();

  fireEvent.keyDown(input, { key: 'Enter' });
  await waitFor(() => expect(askLearnHubAssistant).toHaveBeenCalledTimes(1));
  expect(askLearnHubAssistant).toHaveBeenCalledWith(expect.objectContaining({
    question: 'What does the cell membrane do?',
    context: expect.objectContaining({
      resource_id: 'current-resource',
      title: 'Cell Biology',
      subject: 'Biology',
    }),
  }));

  const citation = await screen.findByRole('button', { name: /cell structure notes/i });
  fireEvent.click(citation);
  expect(onOpenResource).toHaveBeenCalledWith(expect.objectContaining({
    resource_id: 'verified-resource-1',
    title: 'Cell Structure Notes',
  }));
  expect(screen.queryByRole('dialog', { name: /learnhub assistant chat/i })).not.toBeInTheDocument();
});

test('restores a failed question so the student can retry it', async () => {
  askLearnHubAssistant
    .mockRejectedValueOnce({ response: { data: { error: 'The service is unavailable. Please try again.' } } })
    .mockResolvedValueOnce({ answer: 'Cells are basic units of life [1].', sources: [] });
  render(<LearnHubAssistant currentPage="home" onOpenResource={jest.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: /ask learnhub/i }));
  const input = screen.getByRole('textbox', { name: /ask a question/i });
  fireEvent.change(input, { target: { value: 'Explain cells' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  expect(await screen.findByText(/service is unavailable/i)).toBeInTheDocument();
  expect(input).toHaveValue('Explain cells');

  fireEvent.keyDown(input, { key: 'Enter' });
  expect(await screen.findByText(/cells are basic units of life/i)).toBeInTheDocument();
  expect(askLearnHubAssistant).toHaveBeenCalledTimes(2);
});
