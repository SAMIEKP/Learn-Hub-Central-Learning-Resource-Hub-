import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ResourceSearch from './ResourceSearch';
import { searchResources } from '../api/client';

jest.mock('../api/client', () => ({
  searchResources: jest.fn(),
}));

beforeEach(() => {
  searchResources.mockReset();
});

test('searches the backend and opens an approved result', async () => {
  const onOpenResource = jest.fn();
  searchResources.mockResolvedValue({
    results: [{
      id: 'resource-123',
      title: 'Biology Form 3 Notes',
      subject: 'Biology',
      form: 'Form 3',
      topic: 'Cells',
      resource_type: 'book',
    }],
  });
  render(<ResourceSearch onOpenResource={onOpenResource} />);

  fireEvent.change(screen.getByRole('searchbox', { name: /search books/i }), {
    target: { value: 'cells' },
  });
  fireEvent.click(screen.getByRole('button', { name: /search approved resources/i }));

  expect(await screen.findByText('Biology Form 3 Notes')).toBeInTheDocument();
  expect(searchResources).toHaveBeenCalledWith('cells');

  fireEvent.click(screen.getByRole('button', { name: /biology form 3 notes/i }));
  expect(onOpenResource).toHaveBeenCalledWith(expect.objectContaining({
    resource_id: 'resource-123',
    title: 'Biology Form 3 Notes',
    resource_type: 'book',
  }));
});

test('does not send an empty search and shows a safe retry message on API errors', async () => {
  const onOpenResource = jest.fn();
  searchResources.mockRejectedValue(new Error('Backend details must not be shown'));
  render(<ResourceSearch onOpenResource={onOpenResource} />);

  const searchButton = screen.getByRole('button', { name: /search approved resources/i });
  expect(searchButton).toBeDisabled();
  expect(searchResources).not.toHaveBeenCalled();

  fireEvent.change(screen.getByRole('searchbox', { name: /search books/i }), {
    target: { value: 'chemistry' },
  });
  fireEvent.click(searchButton);

  expect(await screen.findByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
  expect(screen.queryByText(/backend details/i)).not.toBeInTheDocument();
  await waitFor(() => expect(searchResources).toHaveBeenCalledTimes(1));
});
