import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIssuesForAdmin, updateIssueStatus, formatDate, getStatusColor, getPriorityColor } from '../data/mockData';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await getIssuesForAdmin();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStats = () => {
    const stats = {
      open: issues.filter(issue => issue.status === 'Open').length,
      inProgress: issues.filter(issue => issue.status === 'In Progress').length,
      resolved: issues.filter(issue => issue.status === 'Resolved').length,
      needsAttention: issues.filter(issue => issue.needsAttention).length,
      total: issues.length
    };
    return stats;
  };

  const handleStatusUpdate = async () => {
    if (!selectedIssue || !newStatus) return;

    try {
      setUpdating(true);
      await updateIssueStatus(selectedIssue.id, newStatus, adminComment);
      
      // Update local state
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === selectedIssue.id 
            ? { ...issue, status: newStatus, lastUpdated: new Date().toISOString() }
            : issue
        )
      );

      // Reset form
      setShowStatusModal(false);
      setSelectedIssue(null);
      setNewStatus('');
      setAdminComment('');
    } catch (error) {
      console.error('Error updating issue:', error);
      alert('Failed to update issue status');
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setShowStatusModal(true);
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and resolve civic issues reported by the community
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={fetchIssues}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Issues</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Open Issues</dt>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 9.172a4 4 0 015.656 0L12 10.686l1.516-1.514a4 4 0 015.656 5.656L12 22l-7.172-7.172a4 4 0 010-5.656z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Needs Attention</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.needsAttention}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Issues
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
                placeholder="Search by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Status
              </label>
              <select
                id="filter"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Issues</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No issues found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No issues have been reported yet.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reported
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Upvotes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {issue.images && issue.images.length > 0 && (
                          <img
                            src={issue.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover mr-4 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center">
                            <Link
                              to={`/issue/${issue.id}`}
                              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 truncate"
                            >
                              {issue.title}
                            </Link>
                            {issue.needsAttention && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {issue.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {issue.location.address} • Reported by {issue.reportedBy}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {issue.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        {formatDate(issue.reportedAt)}
                      </div>
                      <div className="text-xs">
                        {issue.daysSinceReported} days ago
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {issue.upvotes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openStatusModal(issue)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                      >
                        Update Status
                      </button>
                      <Link
                        to={`/issue/${issue.id}`}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Update Issue Status
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Issue: {selectedIssue.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Current Status: {selectedIssue.status}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Comment (Optional)
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                  placeholder="Add a comment about this status update..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
