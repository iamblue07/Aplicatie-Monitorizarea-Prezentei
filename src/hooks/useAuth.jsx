import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [userId, setUserId] = useState(null); // Statul pentru ID-ul utilizatorului
  
  // Modificăm login pentru a accepta și ID-ul utilizatorului
  const login = (userIsOrganizer, idUtilizator) => {
    setIsAuthenticated(true);
    setIsOrganizer(userIsOrganizer);
    setUserId(idUtilizator); // Setăm ID-ul utilizatorului
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setIsOrganizer(false);
    setUserId(null); // Resetăm ID-ul utilizatorului la deconectare
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, isOrganizer, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
