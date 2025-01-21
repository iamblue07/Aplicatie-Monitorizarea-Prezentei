import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const login = (userIsOrganizer) => {
    setIsAuthenticated(true);
    setIsOrganizer(userIsOrganizer);
  }
  
  const logout = () => {
    setIsAuthenticated(false);
    setIsOrganizer(false);
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, isOrganizer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};