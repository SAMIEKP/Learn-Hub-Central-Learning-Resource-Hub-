import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/useAppStore';

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

test('restores the app user from the Clerk profile', async () => {
  useAppStore.getState().logout();
  useAuth.mockReturnValue({
    isSignedIn: true,
    appUser: {
      id: 'restored-user',
      email: 'learner@example.test',
      name: 'Learner Banda',
      school: 'Central School',
    },
    isLoading: false,
    isConfigured: true,
  });

  render(
    <MemoryRouter>
      <ProtectedRoute><p>Private content</p></ProtectedRoute>
    </MemoryRouter>
  );

  expect(await screen.findByText('Private content')).toBeInTheDocument();
  await waitFor(() => expect(useAppStore.getState().user).toMatchObject({
    id: 'restored-user',
    name: 'Learner Banda',
    school: 'Central School',
  }));

  useAppStore.getState().logout();
});

test('does not render protected content while the Supabase session is loading', () => {
  useAppStore.getState().logout();
  useAuth.mockReturnValue({ isSignedIn: false, isLoading: true, isConfigured: true });

  render(
    <MemoryRouter>
      <ProtectedRoute><p>Private content</p></ProtectedRoute>
    </MemoryRouter>
  );

  expect(screen.getByRole('status')).toHaveTextContent(/checking your session/i);
  expect(screen.queryByText('Private content')).not.toBeInTheDocument();
});
