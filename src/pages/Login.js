import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconMail, IconLock, IconEye, IconEyeOff, IconArrowRight, IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
import { useAppStore } from '../store/useAppStore';
import logo from '../logo.svg';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { showAction, login } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - replace with actual API call
    setTimeout(() => {
      const userData = {
        id: 'user-1',
        name: 'SAMUEL KP',
        email: formData.email,
        role: 'Student',
        school: 'Blantyre Secondary School',
        form: 'Form 3',
      };

      login(userData);
      showAction('Login successful! Welcome back.');
      setIsLoading(false);
      navigate('/');
    }, 1000);
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
            <a href="#forgot-password" className="link">Forgot password?</a>
          </div>

          <button type="submit" className="auth-button primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
            {!isLoading && <IconArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-button google">
            <IconBrandGoogle size={18} />
            <span>Google</span>
          </button>
          <button type="button" className="social-button facebook">
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
