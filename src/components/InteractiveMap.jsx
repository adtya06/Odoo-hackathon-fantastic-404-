import React, { useState, useEffect } from 'react';
import DirectLeafletMap from './DirectLeafletMap';
import { reverseGeocode } from '../utils/locationUtils';

const InteractiveMap = ({ onLocationSelect, initialLat, initialLng }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Set initial location if provided
  useEffect(() => {
    if (initialLat && initialLng) {
      setSelectedLocation({ lat: initialLat, lng: initialLng });
      setUseCurrentLocation(false);
    }
  }, [initialLat, initialLng]);

  // Get current location when component mounts
  useEffect(() => {
    if (useCurrentLocation && !currentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  // Update parent when current location is used
  useEffect(() => {
    if (useCurrentLocation && currentLocation && onLocationSelect) {
      onLocationSelect({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address: currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
      });
    }
  }, [useCurrentLocation, currentLocation, onLocationSelect]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: address
          };
          
          setCurrentLocation(locationData);
          setLocationLoading(false);
        } catch (error) {
          console.error('Error getting address:', error);
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          };
          
          setCurrentLocation(locationData);
          setLocationLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setUseCurrentLocation(false);
    
    // Get address from coordinates (mock implementation)
    try {
      const address = await reverseGeocode(location.lat, location.lng);
      
      if (onLocationSelect) {
        onLocationSelect({
          lat: location.lat,
          lng: location.lng,
          address: address
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
      
      if (onLocationSelect) {
        onLocationSelect({
          lat: location.lat,
          lng: location.lng,
          address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
        });
      }
    }
  };

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true);
    setSelectedLocation(null);
    setLocationError(null);
    
    // Get current location if we don't have it or if it's old
    if (!currentLocation) {
      getCurrentLocation();
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Selection Options */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className={`px-4 py-2 text-sm font-medium rounded-md border ${
            useCurrentLocation
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Use Current Location
        </button>
        <button
          type="button"
          onClick={() => setUseCurrentLocation(false)}
          className={`px-4 py-2 text-sm font-medium rounded-md border ${
            !useCurrentLocation
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Choose on Map
        </button>
      </div>

      {/* Instructions and Status */}
      <div className="text-sm">
        {useCurrentLocation ? (
          <div>
            {locationLoading ? (
              <div className="flex items-center text-blue-600">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting your current location...
              </div>
            ) : locationError ? (
              <div className="text-red-600">
                <p>❌ {locationError}</p>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-500 underline"
                >
                  Try again
                </button>
              </div>
            ) : currentLocation ? (
              <p className="text-green-600">
                📍 Using your current location: {currentLocation.address}
              </p>
            ) : (
              <p className="text-gray-600">📍 Your current location will be used for this issue.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">🗺️ Click anywhere on the map to select a location for this issue.</p>
        )}
      </div>

      {/* Direct Leaflet Map */}
      <DirectLeafletMap
        onLocationSelect={!useCurrentLocation ? handleLocationSelect : undefined}
        selectedLocation={!useCurrentLocation ? selectedLocation : currentLocation}
        height="300px"
        showCurrentLocation={useCurrentLocation && currentLocation}
      />
    </div>
  );
};

export default InteractiveMap;