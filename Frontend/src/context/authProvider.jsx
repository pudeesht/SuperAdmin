

import React, {  useState} from 'react';
import { AuthContext } from './authContext';
import { setApiToken } from '../services/api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const login = (newToken) => {
    setToken(newToken);
    setApiToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setApiToken(null);
  };

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

