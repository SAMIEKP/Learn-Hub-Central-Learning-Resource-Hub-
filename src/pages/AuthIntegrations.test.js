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
  finalize: jest.fn(),
  create: jest.fn(),
  sso: jest.fn(),
  resetPasswordEmailCode: {
    sendCode: jest.fn(),
    verifyCode: jest.fn(),
    submitPassword: jest.fn(),
  },
};
const mockSignUp = {
  status: 'missing_requirements',
  password: jest.fn(),
  finalize: jest.fn(),
  sso: jest.fn(),
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

jest.mock('../auth/ClerkAuthProvider', () => ({
  useLearnHubAuth: () => mockAuth,
}));

jest.mock('../api/profiles', () => ({
  updateProfile: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockSignIn.status = 'complete';
  mockSignIn.password.mockResolvedValue({ error: null });
  mockSignIn.finalize.mockResolvedValue(undefined);
  mockSignIn.create.mockResolvedValue({ error: null });
  mockSignIn.sso.mockResolvedValue({ error: null });
  mockSignIn.resetPasswordEmailCode.sendCode.mockResolvedValue({ error: null });
  mockSignIn.resetPasswordEmailCode.verifyCode.mockImplementation(async () => {
    mockSignIn.status = 'needs_new_password';
    return { error: null };
  });
  mockSignIn.resetPasswordEmailCode.submitPassword.mockResolvedValue({ error: null });
  mockSignUp.status = 'missing_requirements';
  mockSignUp.password.mockResolvedValue({ error: null });
  mockSignUp.finalize.mockResolvedValue(undefined);
  mockSignUp.sso.mockResolvedValue({ error: null });
  mockSignUp.verifications.sendEmailCode.mockResolvedValue({ error: null });
  mockSignUp.verifications.verifyEmailCode.mockImplementation(async () => {
    mockSignUp.status = 'complete';
    return { error: null };
  });
  updateProfile.mockResolvedValue({});
});

test('starts Clerk password recovery for the entered email address', async () => {
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.change(screen.getByRole('textbox', { name: 'Email address' }), {
    target: { value: 'learner@example.test' },
  });
  fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));

  await waitFor(() => {
    expect(mockSignIn.create).toHaveBeenCalledWith({ identifier: 'learner@example.test' });
    expect(mockSignIn.resetPasswordEmailCode.sendCode).toHaveBeenCalled();
  });
});

test('starts Google OAuth from both login and signup forms', async () => {
  const { unmount } = render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /google/i }));
  await waitFor(() => expect(mockSignIn.sso).toHaveBeenCalledWith({
    strategy: 'oauth_google',
    redirectUrl: `${window.location.origin}/`,
    redirectCallbackUrl: `${window.location.origin}/complete-profile`,
  }));
  unmount();

  render(<MemoryRouter><Register /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /google/i }));
  await waitFor(() => expect(mockSignUp.sso).toHaveBeenCalledWith({
    strategy: 'oauth_google',
    redirectUrl: `${window.location.origin}/complete-profile`,
    redirectCallbackUrl: `${window.location.origin}/complete-profile`,
  }));
});

test('updates the password after a valid Clerk recovery code', async () => {
  render(<MemoryRouter><ResetPassword /></MemoryRouter>);
  fireEvent.change(screen.getByRole('textbox', { name: 'Email reset code' }), {
    target: { value: '123456' },
  });
  fireEvent.change(screen.getByLabelText('New password'), {
    target: { value: 'StrongPass1!' },
  });
  fireEvent.change(screen.getByLabelText('Confirm new password'), {
    target: { value: 'StrongPass1!' },
  });
  fireEvent.click(screen.getByRole('button', { name: /update password/i }));

  expect(await screen.findByRole('status')).toHaveTextContent(/password has been updated/i);
  expect(mockSignIn.resetPasswordEmailCode.verifyCode).toHaveBeenCalledWith({ code: '123456' });
  expect(mockSignIn.resetPasswordEmailCode.submitPassword).toHaveBeenCalledWith({ password: 'StrongPass1!' });
});

test('creates an account, verifies email, and continues to profile completion', async () => {
  render(<MemoryRouter><Register /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Learner Banda' } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'learner@example.test' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass1!' } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass1!' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  expect(await screen.findByLabelText(/email verification code/i)).toBeInTheDocument();
  expect(mockSignUp.password).toHaveBeenCalledWith({
    emailAddress: 'learner@example.test',
    password: 'StrongPass1!',
    firstName: 'Learner',
    lastName: 'Banda',
  });
  fireEvent.change(screen.getByLabelText(/email verification code/i), { target: { value: '654321' } });
  fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

  await waitFor(() => expect(mockSignUp.verifications.verifyEmailCode).toHaveBeenCalledWith({ code: '654321' }));
  expect(mockSignUp.finalize).toHaveBeenCalled();
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
