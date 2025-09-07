
import React, { createContext} from 'react';


export const AuthContext = createContext();


// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(null);

//   const login = (newToken) => {
//     setToken(newToken);
//   };

//   const logout = () => {
//     setToken(null);
//   };

//   const value = {
//     token,
//     isAuthenticated: !!token,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

