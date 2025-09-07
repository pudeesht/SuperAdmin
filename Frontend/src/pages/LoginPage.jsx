
import React, { useState } from 'react';
import * as api from '../services/api';
import { useAuth } from '../context/useAuth';

function LoginPage() {
  
  //useauth ka login just sets the local token variable in JWT and sets the authentication sa true
  //useauth ke login se JWT token set hojayega jo ki globally thru context le sakte ho aap
  const {login}= useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setError(''); 
    setIsLoading(true);

    try {
      const token = await api.login(email, password);
      
      //isse karne se context mei token store hojaata hai
      login(token);
      
      alert('Login Successful! Check the console for your token.');
      console.log('Your JWT Token:', token);
    
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