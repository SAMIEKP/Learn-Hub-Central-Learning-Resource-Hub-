import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconMail, IconLock, IconEye, IconEyeOff, IconArrowRight, IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
import { useAppStore } from '../store/useAppStore';
import { useLearnHubAuth } from '../auth/ClerkAuthProvider';
import logo from '../logo.svg';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const showAction = useAppStore((state) => state.showAction);
  const { isConfigured, signIn } = useLearnHubAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setIsLoading(true);

    if (!isConfigured || !signIn) {
      setFeedback('Sign-in is not configured yet. Add the Clerk publishable key to the app environment.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn.password({
        identifier: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      if (result.error) {
        setFeedback('Unable to sign in. Please check your email and password, then try again.');
        return;
      }
      if (signIn.status !== 'complete') {
        setFeedback('Your account requires an additional verification step. Complete it with your school account administrator.');
        return;
      }
      await signIn.finalize();
      showAction('Login successful! Welcome back.');
      navigate('/');
    } catch {
      setFeedback('Unable to sign in right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setFeedback('');
    const email = formData.email.trim().toLowerCase();
    if (!email) {
      setFeedback('Enter your email address first, then choose Forgot password.');
      return;
    }
    if (!isConfigured || !signIn) {
      setFeedback('Password recovery is unavailable until Clerk is configured.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn.create({ identifier: email });
      if (error) {
        setFeedback('Unable to send a recovery email. Check the address and try again.');
        return;
      }
      const resetResult = await signIn.resetPasswordEmailCode.sendCode();
      if (resetResult.error) {
        setFeedback('Unable to send a recovery email. Check the address and try again.');
        return;
      }
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      setFeedback('Unable to send a recovery email right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setFeedback('');
    if (!isConfigured || !signIn) {
      setFeedback('Social sign-in is unavailable until Clerk is configured.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn.sso({
        strategy: `oauth_${provider}`,
        redirectUrl: `${window.location.origin}/`,
        redirectCallbackUrl: `${window.location.origin}/complete-profile`,
      });
      if (error) setFeedback('Unable to start social sign-in. Please try again.');
    } catch {
      setFeedback('Unable to start social sign-in right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-page auth-login-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <img src={logo} alt="Learn Hub logo" className="auth-logo-image" />
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to continue to Learn Hub</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <IconMail size={18} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <IconLock size={18} className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <label className="checkbox-label">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <button type="button" className="link auth-text-button" onClick={handlePasswordReset} disabled={isLoading}>Forgot password?</button>
          </div>

          {feedback && <p className="auth-feedback" role="alert">{feedback}</p>}
          <button type="submit" className="auth-button primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
            {!isLoading && <IconArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-button google" onClick={() => handleSocialSignIn('google')} disabled={isLoading}>
            <IconBrandGoogle size={18} />
            <span>Google</span>
          </button>
          <button type="button" className="social-button facebook" onClick={() => handleSocialSignIn('facebook')} disabled={isLoading}>
            <IconBrandFacebook size={18} />
            <span>Facebook</span>
          </button>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
