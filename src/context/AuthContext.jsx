import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Changed storage keys to force a fresh slate for all users
const DB_KEY = 'qs_users_db_v2';
const USER_KEY = 'qs_user_v2';
const TOKENS_KEY = 'qs_tokens_v2';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedTokens = localStorage.getItem(TOKENS_KEY);
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedTokens) {
      setTokens(JSON.parse(savedTokens));
    }
  }, []);

  // Helper to manage users DB
  const getUsersDB = () => JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  
  const saveUserToDB = (userData) => {
    const db = getUsersDB();
    const index = db.findIndex(u => u.email === userData.email);
    if (index >= 0) db[index] = userData;
    else db.push(userData);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  };

  const login = (email) => {
    const db = getUsersDB();
    let existingUser = db.find(u => u.email === email);
    
    if (!existingUser) {
      existingUser = {
        userId: `USR-${Math.floor(Math.random() * 10000)}`,
        email,
        name: email.split('@')[0], 
        phone: "Not provided",
        age: 0,
        isSenior: false,
        digiLockerLinked: false,
        isNew: true, // Force them to complete profile
        createdAt: new Date().toISOString()
      };
      saveUserToDB(existingUser);
    }
    
    setUser(existingUser);
    localStorage.setItem(USER_KEY, JSON.stringify(existingUser));
    return existingUser;
  };

  const signup = (email, name) => {
    const db = getUsersDB();
    const existing = db.find(u => u.email === email);
    if (existing) return login(email); 

    const newUser = {
      userId: `USR-${Math.floor(Math.random() * 10000)}`,
      email,
      name,
      phone: '',
      age: 0,
      isSenior: false,
      digiLockerLinked: false,
      isNew: true, 
      createdAt: new Date().toISOString()
    };
    
    saveUserToDB(newUser);
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData, isNew: false };
    saveUserToDB(updatedUser);
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    // Keep tokens in storage so history persists, but it will be filtered for the next logged-in user
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
    localStorage.setItem(TOKENS_KEY, JSON.stringify(updatedTokens));
    return newToken;
  };

  // Filter tokens on render based on the current user
  const userTokens = tokens.filter(t => t.userId === user?.userId);

  return (
    <AuthContext.Provider value={{ 
      user, 
      tokens: userTokens, 
      login, 
      signup, 
      updateProfile, 
      logout, 
      bookToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
