import React from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";

const LocationComponent = ({
  onLocationUpdate,
  showDetails = false,
  className = "",
}) => {
  const { latitude, longitude, accuracy, loading, error, getCurrentLocation } =
    useCurrentLocation();

  // Notify parent component when location updates
  React.useEffect(() => {
    if (latitude && longitude && onLocationUpdate) {
      onLocationUpdate({ latitude, longitude, accuracy });
    }
  }, [latitude, longitude, accuracy, onLocationUpdate]);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Getting your location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-md p-3 ${className}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Location Access Error
            </h3>
            <div className="mt-1 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-3">
              <button
                onClick={getCurrentLocation}
                className="text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (latitude && longitude) {
    return (
      <div
        className={`bg-green-50 border border-green-200 rounded-md p-3 ${className}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-green-800">
              Location Detected
            </h3>
            {showDetails && (
              <div className="mt-1 text-sm text-green-700">
                <p>Latitude: {latitude.toFixed(6)}</p>
                <p>Longitude: {longitude.toFixed(6)}</p>
                {accuracy && <p>Accuracy: ±{Math.round(accuracy)}m</p>}
              </div>
            )}
            <div className="mt-2">
              <button
                onClick={getCurrentLocation}
                className="text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline"
              >
                Refresh Location
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-4 ${className}`}>
      <svg
        className="mx-auto h-8 w-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <p className="mt-2 text-sm text-gray-500">
        Click to get your current location
      </p>
      <button
        onClick={getCurrentLocation}
        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          className="-ml-0.5 mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Get Location
      </button>
    </div>
  );
};

export default LocationComponent;
