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

  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'admin@civic.gov';
  const ADMIN_PASSWORD = 'admin123';

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

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // Check if it's admin login
      if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminData = {
          id: 'admin',
          username: 'admin',
          email: ADMIN_EMAIL,
          name: 'System Administrator',
          avatar: `https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff`,
          isAdmin: true
        };
        
        setUser(adminData);
        setIsAuthenticated(true);
        localStorage.setItem('civic_user', JSON.stringify(adminData));
        
        return { success: true, isAdmin: true };
      }
      
      // Use API for regular user login
      const { authAPI } = await import('../services/api');
      
      const response = await authAPI.login({
        username: username,
        password: password
      });
      
      if (response.access_token) {
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email || '',
          name: response.user.username,
          avatar: `https://ui-avatars.com/api/?name=${response.user.username}&background=3b82f6&color=fff`,
          isAdmin: false
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('civic_user', JSON.stringify(userData));
        
        return { success: true, isAdmin: false };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.detail || error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      
      // Import API service
      const { authAPI } = await import('../services/api');
      
      // Prepare signup data
      const signupData = {
        username: username,
        password: password
      };
      
      // Add email only if provided
      if (email && email.trim()) {
        signupData.email = email;
      }
      
      const response = await authAPI.signup(signupData);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email || '',
          avatar: `https://ui-avatars.com/api/?name=${username}&background=3b82f6&color=fff`,
          isAdmin: false
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('civic_user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.detail || error.message || 'Signup failed' };
    } finally {
      setLoading(false);
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
    setLocationError,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
