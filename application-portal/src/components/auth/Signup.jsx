import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../shared';
import { Button } from '../shared';

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
    <section className="auth card" data-testid="signup-section">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          testId="signup-firstname"
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          testId="signup-lastname"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          testId="signup-email"
        />
        <Input
          type="password"
          placeholder="Password (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          testId="signup-password"
        />
        <div className="btn-group">
          <Button type="submit" variant="primary" testId="signup-submit">
            Create Account
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            testId="signup-back"
          >
            Back
          </Button>
        </div>
      </form>
    </section>
  );
}
