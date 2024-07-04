// import { createContext } from "react";

// export const initialState = {
//   user: {
//     isAdmin: true,
//   },
// };

// const Context = createContext(initialState);

// export default Context;
// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { getAuthUser,removeAuthUser } from '../../helper/Storage';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthUser());

  const handleLogout = () => {
    removeAuthUser();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
