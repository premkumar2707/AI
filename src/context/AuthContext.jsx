import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('queueSmartUser');
    const savedTokens = localStorage.getItem('queueSmartTokens');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTokens) setTokens(JSON.parse(savedTokens));
  }, []);

  const login = (email) => {
    // Simulated existing user
    const existingUser = {
      userId: `USR-${Math.floor(Math.random() * 10000)}`,
      email,
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      age: 35,
      isSenior: false,
      digiLockerLinked: true,
      createdAt: new Date().toISOString()
    };
    setUser(existingUser);
    localStorage.setItem('queueSmartUser', JSON.stringify(existingUser));
    return existingUser;
  };

  const signup = (email, name) => {
    // New user (needs profile completion)
    const newUser = {
      userId: `USR-${Math.floor(Math.random() * 10000)}`,
      email,
      name,
      isNew: true // Flag to redirect to profile completion
    };
    setUser(newUser);
    localStorage.setItem('queueSmartUser', JSON.stringify(newUser));
    return newUser;
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData, isNew: false };
    setUser(updatedUser);
    localStorage.setItem('queueSmartUser', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setTokens([]);
    localStorage.removeItem('queueSmartUser');
    localStorage.removeItem('queueSmartTokens');
  };

  const bookToken = (tokenData) => {
    const newToken = {
      tokenId: `TKN-${Math.floor(Math.random() * 10000)}`,
      userId: user?.userId,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      ...tokenData
    };
    const updatedTokens = [newToken, ...tokens];
    setTokens(updatedTokens);
    localStorage.setItem('queueSmartTokens', JSON.stringify(updatedTokens));
    return newToken;
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, signup, updateProfile, logout, bookToken }}>
      {children}
    </AuthContext.Provider>
  );
};
