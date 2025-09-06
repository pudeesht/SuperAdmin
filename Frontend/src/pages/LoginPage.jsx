
import React, { useState } from 'react';
import { login } from '../services/api';

function LoginPage() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setError(''); 
    setIsLoading(true);

    try {
      const token = await login(email, password);
      
      // --- IMPORTANT ---
      // Per the project spec, we are storing the token in memory for this
      // minimal UI. A real app would use secure storage like HttpOnly cookies.
      
      alert('Login Successful! Check the console for your token.');
      console.log('Your JWT Token:', token);
      
      // Here you would typically store the token and redirect the user
      // For now, we'll just log it.

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;