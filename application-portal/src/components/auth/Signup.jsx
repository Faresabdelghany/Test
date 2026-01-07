import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input, Button, ThemeToggle } from '../shared';
import './Auth.css';

export function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await signup({
      firstName,
      lastName,
      email,
      password,
    });

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>
      <section className="auth card" data-testid="signup-section">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join us and start your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <Input
              label="First Name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              testId="signup-firstname"
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              testId="signup-lastname"
            />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            testId="signup-email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            testId="signup-password"
          />
          <div className="btn-group">
            <Button type="submit" variant="primary" testId="signup-submit" className="auth-submit">
              Create Account
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/login')}
              testId="signup-back"
            >
              Back to Login
            </Button>
          </div>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
