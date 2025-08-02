import React, { createContext, useContext, useState, useEffect } from 'react';
import { isValidCoordinates } from '../utils/locationUtils';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  userLocation: { latitude: null, longitude: null, accuracy: null, timestamp: null },
  locationLoading: false,
  locationError: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  loading: false,
  updateUserLocation: () => {},
  clearUserLocation: () => {},
  setLocationLoading: () => {},
  setLocationError: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('civic_user');
    const savedLocation = localStorage.getItem('civic_user_location');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      if (isValidCoordinates(location.latitude, location.longitude)) {
        setUserLocation(location);
      }
    }
    
    setLoading(false);
  }, []);

  // Function to update user location
  const updateUserLocation = (locationData) => {
    const { latitude, longitude, accuracy } = locationData;
    
    if (!isValidCoordinates(latitude, longitude)) {
      setLocationError('Invalid location coordinates');
      return;
    }

    const locationInfo = {
      latitude,
      longitude,
      accuracy,
      timestamp: Date.now()
    };

    setUserLocation(locationInfo);
    setLocationError(null);
    localStorage.setItem('civic_user_location', JSON.stringify(locationInfo));
  };

  // Function to clear user location
  const clearUserLocation = () => {
    setUserLocation({
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp: null
    });
    localStorage.removeItem('civic_user_location');
  };

  const login = async (email, password) => {
    // Mock authentication - in real app, this would call an API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('civic_user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (email, password, name) => {
    // Mock signup - in real app, this would call an API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(), // Mock ID
        email: email,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('civic_user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearUserLocation();
    localStorage.removeItem('civic_user');
  };

  const value = {
    isAuthenticated,
    user,
    userLocation,
    locationLoading,
    locationError,
    login,
    signup,
    logout,
    loading,
    updateUserLocation,
    clearUserLocation,
    setLocationLoading,
    setLocationError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
