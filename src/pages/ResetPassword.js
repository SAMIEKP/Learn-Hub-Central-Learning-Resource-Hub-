import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IconArrowRight, IconLock, IconMail } from '@tabler/icons-react';
import { supabase } from '../lib/supabaseClient';
import logo from '../logo.svg';
import './Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isRequestMode, setIsRequestMode] = useState(!searchParams.get('access_token'));

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    if (accessToken) {
      setIsRequestMode(false);
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');

    if (isRequestMode) {
      if (!email.trim()) {
        setFeedback('Enter your email address to request a password reset.');
        return;
      }
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
        if (error) {
          setFeedback('Unable to send a recovery email. Check the address and try again.');
          return;
        }
        setFeedback('A password reset email has been sent. Check your inbox and click the link to reset your password.');
      } catch {
        setFeedback('Unable to send a recovery email right now. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
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

      setIsLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setFeedback('Unable to update your password. The reset link may have expired.');
          return;
        }
        setIsComplete(true);
        setFeedback('Your password has been updated. You can now sign in.');
      } catch {
        setFeedback('Unable to update your password right now. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo"><img src={logo} alt="Learn Hub logo" className="auth-logo-image" /></div>
          <h1>Reset your password</h1>
          <p>{isRequestMode ? 'Enter your email to receive a password reset link' : 'Choose a new password for your Learn Hub account'}</p>
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
            {isRequestMode ? (
              <div className="form-group">
                <label htmlFor="reset-email">Email address</label>
                <div className="input-wrapper">
                  <IconMail size={18} className="input-icon" />
                  <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
            {feedback && <p className="auth-feedback" role="alert">{feedback}</p>}
            <button type="submit" className="auth-button primary" disabled={isLoading}>
              {isLoading ? (isRequestMode ? 'Sending email...' : 'Updating password...') : (isRequestMode ? 'Send reset email' : 'Update password')}
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
