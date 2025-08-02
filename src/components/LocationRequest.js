import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocationComponent from './LocationComponent';
import useCurrentLocation from '../hooks/useCurrentLocation';

const LocationRequest = () => {
  const { updateUserLocation, setLocationLoading, setLocationError } = useAuth();
  const navigate = useNavigate();
  const [showSkipOption, setShowSkipOption] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const { latitude, longitude, accuracy, loading, error } = useCurrentLocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000
  });

  // Show skip option after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkipOption(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Update loading state in auth context
  useEffect(() => {
    setLocationLoading(loading);
  }, [loading, setLocationLoading]);

  // Update error state in auth context
  useEffect(() => {
    setLocationError(error);
  }, [error, setLocationError]);

  // Handle successful location acquisition
  useEffect(() => {
    if (latitude && longitude && !locationGranted) {
      updateUserLocation({ latitude, longitude, accuracy });
      setLocationGranted(true);
      
      // Auto-redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [latitude, longitude, accuracy, updateUserLocation, navigate, locationGranted]);

  const handleSkipLocation = () => {
    setLocationLoading(false);
    setLocationError(null);
    navigate('/dashboard');
  };

  const handleTryAgain = () => {
    window.location.reload(); // Simple way to restart the location request
  };

  if (locationGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Location Detected!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've found your location. Redirecting to dashboard...
            </p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enable Location Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            To show you nearby civic issues, we need access to your current location.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Location Component */}
          <LocationComponent 
            onLocationUpdate={updateUserLocation}
            showDetails={true}
            className="w-full"
          />

          {/* Benefits of enabling location */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Why we need your location
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Show civic issues within 5km of your location</li>
                    <li>Sort issues by distance from you</li>
                    <li>Help you report issues at your exact location</li>
                    <li>Provide accurate distance calculations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3">
            {error && (
              <button
                onClick={handleTryAgain}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            )}
            
            {showSkipOption && (
              <button
                onClick={handleSkipLocation}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Skip for now (Show all issues)
              </button>
            )}
          </div>

          {/* Privacy note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your location data is stored locally and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationRequest;
