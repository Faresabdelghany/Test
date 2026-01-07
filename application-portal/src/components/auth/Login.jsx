import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../shared';
import { Button } from '../shared';

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
    <section className="auth card" data-testid="login-section">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          testId="login-email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          testId="login-password"
        />
        <Button type="submit" variant="primary" testId="login-submit">
          Login
        </Button>
      </form>
      <p>
        New user? <Link to="/signup">Signup</Link>
      </p>
    </section>
  );
}
