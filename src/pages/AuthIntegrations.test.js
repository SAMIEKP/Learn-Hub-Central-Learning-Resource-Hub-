import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import CompleteProfile from './CompleteProfile';
import { updateProfile } from '../api/profiles';
import { useAppStore } from '../store/useAppStore';

const mockSignIn = {
  status: 'complete',
  password: jest.fn(),
  resetPasswordEmailCode: {
    sendCode: jest.fn(),
  },
};
const mockSignUp = {
  status: 'missing_requirements',
  password: jest.fn(),
  finalize: jest.fn(),
  verifications: {
    sendEmailCode: jest.fn(),
    verifyEmailCode: jest.fn(),
  },
};
const mockAuth = {
  isConfigured: true,
  signIn: mockSignIn,
  signUp: mockSignUp,
};

jest.mock('../auth/SupabaseAuthProvider', () => ({
  useLearnHubAuth: () => mockAuth,
}));

jest.mock('../api/profiles', () => ({
  updateProfile: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockSignIn.status = 'complete';
  mockSignIn.password.mockResolvedValue({ error: null });
  mockSignIn.resetPasswordEmailCode.sendCode.mockResolvedValue({ error: null });
  mockSignUp.status = 'missing_requirements';
  mockSignUp.password.mockResolvedValue({ error: null });
  mockSignUp.finalize.mockResolvedValue(undefined);
  mockSignUp.verifications.sendEmailCode.mockResolvedValue({ error: null });
  mockSignUp.verifications.verifyEmailCode.mockImplementation(async () => {
    mockSignUp.status = 'complete';
    return { error: null };
  });
  updateProfile.mockResolvedValue({});
});

test('starts Supabase password recovery for the entered email address', async () => {
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.change(screen.getByRole('textbox', { name: 'Email address' }), {
    target: { value: 'learner@example.test' },
  });
  fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));

  await waitFor(() => {
    expect(mockSignIn.resetPasswordEmailCode.sendCode).toHaveBeenCalled();
  });
});

test('creates an account and continues to profile completion when auto-confirmed', async () => {
  mockSignUp.password.mockResolvedValue({ data: { session: {} }, error: null });
  render(<MemoryRouter><Register /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Learner Banda' } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'learner@example.test' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass1!' } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass1!' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  expect(mockSignUp.password).toHaveBeenCalledWith({
    emailAddress: 'learner@example.test',
    password: 'StrongPass1!',
    firstName: 'Learner',
    lastName: 'Banda',
  });
});

test('saves completed profile details to the Supabase profiles table', async () => {
  useAppStore.getState().login({
    id: 'learner-id',
    name: 'Learner Banda',
    email: 'learner@example.test',
    role: 'student',
  });
  render(<MemoryRouter><CompleteProfile /></MemoryRouter>);

  fireEvent.change(screen.getByRole('textbox', { name: 'School' }), {
    target: { value: 'Central School' },
  });
  fireEvent.change(screen.getByLabelText('Class / Form'), {
    target: { value: 'Form 3' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Mathematics' }));
  fireEvent.click(screen.getByRole('button', { name: /complete profile/i }));

  await waitFor(() => expect(updateProfile).toHaveBeenCalledWith('learner-id', expect.objectContaining({
    school: 'Central School',
    form: 'Form 3',
    subjects: ['Mathematics'],
  })));
  expect(JSON.parse(window.localStorage.getItem('learnhub-profile-details'))).toMatchObject({
    school: 'Central School',
    form: 'Form 3',
  });
  useAppStore.getState().logout();
});
