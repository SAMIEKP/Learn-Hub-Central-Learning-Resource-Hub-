import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { IconMail, IconLock, IconUser, IconEye, IconEyeOff, IconArrowRight, IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
import { useAppStore } from '../store/useAppStore';
import { useLearnHubAuth } from '../auth/ClerkAuthProvider';
import logo from '../logo.svg';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const showAction = useAppStore((state) => state.showAction);
  const { isConfigured, signUp } = useLearnHubAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const passwordChecks = useMemo(() => ({
    length: formData.password.length >= 8,
    lowercase: /[a-z]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  }), [formData.password]);
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = passwordScore === 0 ? 'empty' : passwordScore === 1 ? 'weak' : passwordScore === 2 ? 'fair' : passwordScore < 5 ? 'good' : 'strong';
  const passwordIsValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');

    if (!passwordIsValid) {
      setFeedback('Choose a stronger password using all the requirements below.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFeedback('Passwords do not match.');
      return;
    }

    if (!isConfigured || !signUp) {
      setFeedback('Account creation is not configured yet. Add the Clerk publishable key to the app environment.');
      return;
    }

    setIsLoading(true);
    try {
      const names = formData.fullName.trim().split(/\s+/);
      const { error } = await signUp.password({
        emailAddress: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: names[0],
        lastName: names.slice(1).join(' '),
      });
      if (error) {
        setFeedback('Unable to create your account. Please check your details and try again.');
        return;
      }
      if (signUp.status === 'complete') {
        await signUp.finalize();
        showAction('Account created successfully!');
        navigate('/complete-profile');
        return;
      }
      const codeResult = await signUp.verifications.sendEmailCode();
      if (codeResult.error) {
        setFeedback('Your account was started, but an email verification code could not be sent. Try again.');
        return;
      }
      setIsVerificationPending(true);
      setFeedback('Enter the verification code sent to your email address.');
    } catch {
      setFeedback('Unable to create your account right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();
    if (!signUp || !verificationCode.trim()) return;
    setIsLoading(true);
    setFeedback('');
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code: verificationCode.trim() });
      if (error || signUp.status !== 'complete') {
        setFeedback('That verification code could not be confirmed. Check it and try again.');
        return;
      }
      await signUp.finalize();
      showAction('Account created successfully!');
      navigate('/complete-profile');
    } catch {
      setFeedback('Unable to verify your email right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setFeedback('');
    if (!isConfigured || !signUp) {
      setFeedback('Social sign-in is unavailable until Clerk is configured.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp.sso({
        strategy: `oauth_${provider}`,
        redirectUrl: `${window.location.origin}/complete-profile`,
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
    <div className="auth-page auth-register-page">
      <div className="auth-container auth-register-container">
        <div className="auth-header">
          <div className="auth-logo">
            <img src={logo} alt="Learn Hub logo" className="auth-logo-image" />
          </div>
          <h1>Create account</h1>
          <p>Join Learn Hub to discover educational resources</p>
        </div>

        {isVerificationPending ? (
          <form className="auth-form auth-register-form" onSubmit={handleVerifyEmail}>
            <div className="form-group">
              <label htmlFor="verification-code">Email verification code</label>
              <div className="input-wrapper">
                <IconLock size={18} className="input-icon" />
                <input id="verification-code" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" required />
              </div>
            </div>
            {feedback && <p className="auth-feedback" role="alert">{feedback}</p>}
            <button type="submit" className="auth-button primary" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify email'}
              {!isLoading && <IconArrowRight size={18} />}
            </button>
          </form>
        ) : <form className="auth-form auth-register-form" onSubmit={handleSubmit}>
          <div className="form-group auth-register-name">
            <label htmlFor="fullName">Full name</label>
            <div className="input-wrapper">
              <IconUser size={18} className="input-icon" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Samuel Kapalamula"
                value={formData.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group auth-register-email">
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

          <div className="password-row auth-register-passwords">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${formData.password && !passwordIsValid ? 'input-invalid' : ''}`}>
                <IconLock size={18} className="input-icon" />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password} onChange={handleChange} required autoComplete="new-password" aria-describedby="password-requirements" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className={`input-wrapper ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-invalid' : ''}`}>
                <IconLock size={18} className="input-icon" />
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" aria-describedby="password-match" />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>{showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}</button>
              </div>
            </div>
          </div>

          <div id="password-requirements" className={`password-validator auth-register-requirements strength-${passwordStrength}`}>
            <div
              className="password-strength-bar"
              role="meter"
              aria-label="Password strength"
              aria-valuemin="0"
              aria-valuemax={Object.keys(passwordChecks).length}
              aria-valuenow={passwordScore}
              aria-valuetext={passwordStrength === 'empty' ? 'No password entered' : `${passwordStrength} password`}
            >
              {[1, 2, 3, 4, 5].map((segment) => <span key={segment} className={passwordScore >= segment ? 'filled' : ''} />)}
            </div>
          </div>
          {formData.confirmPassword && <small id="password-match" className={`password-match auth-register-match ${formData.password === formData.confirmPassword ? 'is-valid' : ''}`}>{formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}</small>}

          <div className="form-actions auth-register-terms">
            <label className="checkbox-label">
              <input type="checkbox" name="terms" required />
              <span>I agree to the <a href="#terms" className="link">Terms of Service</a> and <a href="#privacy" className="link">Privacy Policy</a></span>
            </label>
          </div>

          {feedback && <p className="auth-feedback" role="alert">{feedback}</p>}
          <button type="submit" className="auth-button primary auth-register-submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
            {!isLoading && <IconArrowRight size={18} />}
          </button>
        </form>}

        <div className="auth-divider"><span>or sign up with</span></div>
        <div className="social-buttons">
          <button type="button" className="social-button google" onClick={() => handleSocialSignIn('google')} disabled={isLoading}><IconBrandGoogle size={18} /><span>Google</span></button>
          <button type="button" className="social-button facebook" onClick={() => handleSocialSignIn('facebook')} disabled={isLoading}><IconBrandFacebook size={18} /><span>Facebook</span></button>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
