import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import AuthPage from './AuthPage';
import { useAppStore } from '../store/useAppStore';
import ProtectedRoute from '../components/ProtectedRoute';

jest.mock('../lib/supabaseClient', () => ({
  supabase: null,
  isSupabaseConfigured: false,
}));

function CurrentPath() {
  const location = useLocation();
  return <output aria-label="Current path">{location.pathname}</output>;
}

test('uses the footer links to move between login and signup without top switch buttons', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Routes>
      <CurrentPath />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /log in|sign up/i })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: /sign up/i }));
  expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/current path/i)).toHaveTextContent('/register');

  fireEvent.click(screen.getByRole('link', { name: /sign in/i }));
  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/current path/i)).toHaveTextContent('/login');
});

test('password recovery and social sign-in controls provide feedback when auth is not configured', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
  expect(screen.getByRole('alert')).toHaveTextContent(/enter your email address/i);

  fireEvent.click(screen.getByRole('button', { name: /google/i }));
  expect(screen.getByRole('alert')).toHaveTextContent(/social sign-in is unavailable/i);
});

test('does not submit account creation when Clerk is not configured', () => {
  useAppStore.getState().logout();

  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<AuthPage />} />
        <Route path="/complete-profile" element={<ProtectedRoute><h1>Complete your profile</h1></ProtectedRoute>} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: '  Taylor Banda  ' } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'TAYLOR@example.com' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass1!' } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass1!' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(/not configured yet/i);
  expect(useAppStore.getState().isAuthenticated).toBe(false);

  useAppStore.getState().logout();
});
