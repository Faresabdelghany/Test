import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input, Button, ThemeToggle } from '../shared';
import './Auth.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate(result.isAdmin ? '/admin' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>
      <section className="auth card" data-testid="login-section">
        <div className="auth-header">
          <h2>Welcome Back</h2>
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
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            testId="login-password"
            placeholder="Enter your password"
          />
          <Button type="submit" variant="primary" testId="login-submit" className="auth-submit">
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
