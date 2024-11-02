// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    bio: '',
    isLoading: true,
  });

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/users/profile/');
      if (response.status === 200) {
        setUser({
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio || 'This user has no bio.',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};