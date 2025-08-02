import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getIssues, formatDate } from '../data/mockData';
import { filterIssuesByRadius, formatDistance } from '../utils/locationUtils';
import LocationComponent from './LocationComponent';

const Dashboard = () => {
  const { user, userLocation, updateUserLocation } = useAuth();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [radiusFilter, setRadiusFilter] = useState(5);
  const [showLocationSettings, setShowLocationSettings] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const allIssues = await getIssues();
        setIssues(allIssues);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    // Apply location-based filtering if user location is available
    if (userLocation.latitude && userLocation.longitude) {
      filtered = filterIssuesByRadius(
        issues,
        userLocation.latitude,
        userLocation.longitude,
        radiusFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(issue => issue.status.toLowerCase() === filter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, filter, userLocation, radiusFilter]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const stats = {
    total: filteredIssues.length,
    nearby: userLocation.latitude && userLocation.longitude ? filteredIssues.length : 0,
    open: filteredIssues.filter(issue => issue.status.toLowerCase() === 'open').length,
    inProgress: filteredIssues.filter(issue => issue.status.toLowerCase() === 'in progress').length,
    resolved: filteredIssues.filter(issue => issue.status.toLowerCase() === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Civic Issues Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {userLocation.latitude && userLocation.longitude 
              ? `Showing issues within ${radiusFilter}km of your location` 
              : 'Track and manage civic issues reported in your community'
            }
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          {userLocation.latitude && userLocation.longitude && (
            <button
              onClick={() => setShowLocationSettings(!showLocationSettings)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </button>
          )}
          <Link
            to="/submit-issue"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Report New Issue
          </Link>
        </div>
      </div>

      {/* Location Settings Panel */}
      {showLocationSettings && (
        <div className="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Location Settings
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Radius
                </label>
                <select
                  id="radius"
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(Number(e.target.value))}
                  className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Issues within this radius will be shown
                </p>
              </div>
              
              <div>
                <LocationComponent 
                  onLocationUpdate={updateUserLocation}
                  showDetails={true}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Location Warning */}
      {!userLocation.latitude && !userLocation.longitude && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Location not available
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>Enable location access to see nearby issues and get distance information.</p>
              </div>
              <div className="mt-3">
                <Link
                  to="/location-request"
                  className="text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-500"
                >
                  Enable Location →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {userLocation.latitude && userLocation.longitude && (
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Nearby</dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.nearby}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Open</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.open}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">In Progress</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.inProgress}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Resolved</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.resolved}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">Search issues</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md leading-5 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Cards */}
      <div>
        {filteredIssues.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No issues found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by reporting a new civic issue.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <Link to={`/issue/${issue.id}`} className="block">
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                    {issue.images && issue.images.length > 0 ? (
                      <img
                        src={issue.images[0]}
                        alt={issue.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                    {/* Status and Priority Badges */}
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    {/* Upvotes Badge */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 flex items-center space-x-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xs text-white font-medium">{issue.upvotes}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {issue.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                      {issue.description}
                    </p>
                    
                    {/* Category */}
                    <div className="flex items-center mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {issue.category}
                      </span>
                    </div>

                    {/* Location and Date */}
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{issue.location.address}</span>
                      </div>
                      {issue.distance !== undefined && (
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span>{formatDistance(issue.distance)} away</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>By {issue.reportedBy}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatDate(issue.reportedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
