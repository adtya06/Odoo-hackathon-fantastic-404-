import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issues } from '../data/mockData';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchIssue = () => {
      const foundIssue = issues.find(issue => issue.id === parseInt(id));
      setIssue(foundIssue);
      setLoading(false);
    };

    fetchIssue();
  }, [id]);

  const handleVoteToReopen = () => {
    if (!hasVoted && issue && issue.status === 'Resolved') {
      const updatedIssue = {
        ...issue,
        reopenVotes: (issue.reopenVotes || 0) + 1
      };
      setIssue(updatedIssue);
      setHasVoted(true);
      setShowVoteModal(false);

      if (updatedIssue.reopenVotes >= 5) {
        alert('Issue has been reopened due to community voting!');
      }
    }
  };

  const handleUpvote = () => {
    if (issue) {
      const updatedIssue = {
        ...issue,
        upvotes: (issue.upvotes || 0) + 1
      };
      setIssue(updatedIssue);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const updatedIssue = {
        ...issue,
        comments: [...(issue.comments || []), {
          id: Date.now(),
          author: 'Current User',
          text: newComment,
          timestamp: new Date().toLocaleString()
        }]
      };
      setIssue(updatedIssue);
      setNewComment('');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Issue not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                {issue.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                {issue.priority.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{issue.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{issue.description}</p>
          </div>

          {/* Issue Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Reporter:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{issue.reportedBy}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Category:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{issue.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Date Reported:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  {new Date(issue.reportedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Location:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{issue.location.address}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Upvotes:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">{issue.upvotes || 0}</span>
              </div>
              {issue.status === 'Resolved' && (
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Reopen Votes:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">{issue.reopenVotes || 0}/5</span>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          {issue.images && issue.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Photos ({issue.images.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {issue.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-25 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleUpvote}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              👍 Upvote ({issue.upvotes || 0})
            </button>
            
            {issue.status === 'Resolved' && (
              <button
                onClick={() => setShowVoteModal(true)}
                disabled={hasVoted}
                className={`px-4 py-2 rounded-md transition-colors ${
                  hasVoted
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {hasVoted ? 'Already Voted' : 'Vote to Reopen'}
              </button>
            )}

            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Issue
            </button>
          </div>

          {/* Comments Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Comments</h3>
            
            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post
                </button>
              </div>
            </form>

            {/* Comments List */}
            {issue.comments && issue.comments.length > 0 ? (
              <div className="space-y-3">
                {issue.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      {/* Vote to Reopen Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Vote to Reopen Issue</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Do you believe this issue should be reopened? If 5 community members vote to reopen, 
              the issue will be automatically reopened for review.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Current votes: {issue.reopenVotes || 0}/5
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVoteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleVoteToReopen}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
              >
                Vote to Reopen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Issue photo"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetail;
