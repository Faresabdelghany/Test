import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Input, Button, ThemeToggle } from '../shared';
import './Auth.css';

// SVG Icons
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(result.isAdmin ? '/admin' : '/dashboard');
      } else {
        setError(result.error);
        showError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      showError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>
      <section className="auth" data-testid="login-section">
        <div className="auth-header">
          <h2>Welcome <span className="accent">Back</span></h2>
          <p className="auth-subtitle">Sign in to continue to your portal</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            testId="login-email"
            placeholder="your.email@example.com"
            icon={<EmailIcon />}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            testId="login-password"
            placeholder="Enter your password"
            icon={<LockIcon />}
          />
          <Button
            type="submit"
            variant="primary"
            testId="login-submit"
            className="auth-submit"
            loading={isLoading}
          >
            Sign In
          </Button>
        </form>
        <div className="auth-footer">
          <p>
            New user? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
