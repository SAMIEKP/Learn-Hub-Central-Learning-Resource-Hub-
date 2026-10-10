import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IconArrowRight, IconLock, IconMail } from '@tabler/icons-react';
import { useLearnHubAuth } from '../auth/ClerkAuthProvider';
import logo from '../logo.svg';
import './Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isConfigured, signIn } = useLearnHubAuth();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');
    const passwordIsValid = password.length >= 8
      && /[a-z]/.test(password)
      && /[A-Z]/.test(password)
      && /\d/.test(password)
      && /[^A-Za-z0-9]/.test(password);
    if (!passwordIsValid) {
      setFeedback('Use at least 8 characters with uppercase and lowercase letters, a number, and a symbol.');
      return;
    }
    if (password !== confirmPassword) {
      setFeedback('Passwords do not match.');
      return;
    }
    if (!isConfigured || !signIn) {
      setFeedback('Password recovery is unavailable until Clerk is configured.');
      return;
    }

    setIsLoading(true);
    try {
      if (!code.trim()) {
        setFeedback('Enter the password reset code sent to your email.');
        return;
      }
      const { error: codeError } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
      if (codeError || signIn.status !== 'needs_new_password') {
        setFeedback('That reset code could not be confirmed. Check it and try again.');
        return;
      }
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password });
      if (error) {
        setFeedback('This reset code may have expired. Request a new password reset and try again.');
        return;
      }
      setIsComplete(true);
      setFeedback('Your password has been updated. You can now sign in.');
    } catch {
      setFeedback('Unable to update your password right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isConfigured || !signIn || !email.trim()) {
      setFeedback('Enter the email address for your account first.');
      return;
    }
    setIsLoading(true);
    setFeedback('');
    try {
      const { error } = await signIn.create({ identifier: email.trim().toLowerCase() });
      if (error) throw error;
      const result = await signIn.resetPasswordEmailCode.sendCode();
      if (result.error) throw result.error;
      setFeedback('A new password reset code has been sent.');
    } catch {
      setFeedback('Unable to send a reset code. Check the email address and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo"><img src={logo} alt="Learn Hub logo" className="auth-logo-image" /></div>
          <h1>Reset your password</h1>
          <p>Choose a new password for your Learn Hub account</p>
        </div>
        {isComplete ? (
          <div className="auth-reset-complete">
            <p className="auth-feedback" role="status">{feedback}</p>
            <button type="button" className="auth-button primary" onClick={() => navigate('/login')}>
              Go to sign in <IconArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reset-email">Email address</label>
              <div className="input-wrapper">
                <IconMail size={18} className="input-icon" />
                <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </div>
            </div>
            <button type="button" className="link auth-text-button" onClick={() => void resendCode()} disabled={isLoading}>Send or resend reset code</button>
            <div className="form-group">
              <label htmlFor="reset-code">Email reset code</label>
              <div className="input-wrapper">
                <IconLock size={18} className="input-icon" />
                <input id="reset-code" type="text" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="one-time-code" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New password</label>
              <div className="input-wrapper">
                <IconLock size={18} className="input-icon" />
                <input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirm new password</label>
              <div className="input-wrapper">
                <IconLock size={18} className="input-icon" />
                <input id="confirm-new-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />
              </div>
            </div>
            {feedback && <p className="auth-feedback" role="alert">{feedback}</p>}
            <button type="submit" className="auth-button primary" disabled={isLoading}>
              {isLoading ? 'Updating password...' : 'Update password'}
              {!isLoading && <IconArrowRight size={18} />}
            </button>
          </form>
        )}
        <div className="auth-footer">
          <p><Link to="/login" className="link">Back to sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
