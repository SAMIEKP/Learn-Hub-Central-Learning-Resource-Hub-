import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import AuthPage from './AuthPage';
import { useAppStore } from '../store/useAppStore';
import ProtectedRoute from '../components/ProtectedRoute';

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

test('creates a frontend account and continues to profile completion', () => {
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
  fireEvent.change(screen.getByLabelText(/^i am a$/i), { target: { value: 'teacher' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass1!' } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass1!' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  expect(screen.getByRole('heading', { name: /complete your profile/i })).toBeInTheDocument();
  expect(useAppStore.getState()).toMatchObject({
    isAuthenticated: true,
    user: {
      name: 'Taylor Banda',
      email: 'taylor@example.com',
      role: 'Teacher',
    },
  });

  useAppStore.getState().logout();
});
