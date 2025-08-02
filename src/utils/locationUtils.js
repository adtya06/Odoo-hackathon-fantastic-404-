/**
 * Calculate the distance between two geographical points using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point  
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Filter issues within a specific radius from user location
 * @param {Array} issues - Array of issue objects with location coordinates
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {number} radiusKm - Radius in kilometers (default: 5km)
 * @returns {Array} Filtered and sorted issues with distance
 */
export const filterIssuesByRadius = (issues, userLat, userLng, radiusKm = 5) => {
  if (!issues || !userLat || !userLng) {
    return [];
  }

  return issues
    .map(issue => ({
      ...issue,
      distance: calculateDistance(
        userLat, 
        userLng, 
        issue.location.coordinates.lat, 
        issue.location.coordinates.lng
      )
    }))
    .filter(issue => issue.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 0.1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${distance.toFixed(0)}km`;
  }
};

/**
 * Get location permission status
 * @returns {Promise<string>} Permission status: 'granted', 'denied', 'prompt', or 'unsupported'
 */
export const getLocationPermissionStatus = async () => {
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'unsupported';
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state;
  } catch (error) {
    console.error('Error checking location permission:', error);
    return 'unsupported';
  }
};

/**
 * Check if geolocation is supported by the browser
 * @returns {boolean} True if geolocation is supported
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};

/**
 * Get a human-readable address from coordinates (mock implementation)
 * In a real app, you would use a geocoding service like Google Maps, Mapbox, or OpenStreetMap
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Mock address string
 */
export const reverseGeocode = async (lat, lng) => {
  // Mock implementation - in production, replace with actual geocoding service
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !isNaN(lat) && !isNaN(lng)
  );
};
