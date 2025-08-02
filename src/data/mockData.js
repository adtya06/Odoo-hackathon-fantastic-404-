// Mock data for civic issues
export const mockIssues = [
  {
    id: 1,
    title: "Pothole on Main Street",
    description: "Large pothole causing damage to vehicles near the intersection of Main St and Oak Ave. It's been there for weeks and is getting worse with the recent rain.",
    category: "Road Infrastructure",
    status: "Open",
    priority: "High",
    reportedBy: "Anonymous",
    reportedAt: "2024-01-15T10:30:00Z",
    location: {
      address: "Main St & Oak Ave, Downtown",
      coordinates: { lat: 30.77, lng: 76.7401 }
    },
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      "https://images.unsplash.com/photo-1591214851171-4a34c2da1b19?w=400"
    ],
    upvotes: 15,
    comments: [
      {
        id: 1,
        author: "Jane Smith",
        text: "I also hit this pothole yesterday. It's really dangerous!",
        timestamp: "2024-01-16T09:00:00Z"
      },
      {
        id: 2,
        author: "Mike Johnson",
        text: "City council should prioritize fixing this.",
        timestamp: "2024-01-16T14:30:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Broken Streetlight on Elm Street",
    description: "Streetlight has been out for over a month, making the area unsafe for pedestrians at night.",
    category: "Public Safety",
    status: "In Progress",
    priority: "Medium",
    reportedBy: "John Doe",
    reportedAt: "2024-01-10T18:45:00Z",
    location: {
      address: "Elm Street, Block 200",
      coordinates: { lat: 30.7341, lng: 76.7385 }
    },
    images: [
      "https://images.unsplash.com/photo-1574391884720-bbc3d817bbfb?w=400"
    ],
    upvotes: 8,
    comments: []
  },
  {
    id: 3,
    title: "Overflowing Trash Bins in Central Park",
    description: "Multiple trash bins are overflowing, attracting pests and creating an unsanitary environment.",
    category: "Waste Management",
    status: "Open",
    priority: "Medium",
    reportedBy: "Sarah Wilson",
    reportedAt: "2024-01-12T16:20:00Z",
    location: {
      address: "Central Park, Section A",
      coordinates: { lat: 30.7318, lng: 76.7402 }
    },
    images: [
      "https://images.unsplash.com/photo-1586825883318-4b1b0c8f4d89?w=400",
      "https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=400",
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400"
    ],
    upvotes: 12,
    comments: [
      {
        id: 1,
        author: "Tom Brown",
        text: "This has been an ongoing issue. We need more frequent pickup.",
        timestamp: "2024-01-13T10:15:00Z"
      }
    ]
  },
  {
    id: 4,
    title: "Graffiti on Public Building",
    description: "Vandalism on the side of the library building needs to be cleaned up.",
    category: "Vandalism",
    status: "Resolved",
    priority: "Low",
    reportedBy: "Anonymous",
    reportedAt: "2024-01-05T11:00:00Z",
    location: {
      address: "Public Library, 123 Library Ave",
      coordinates: { lat: 30.7310, lng: 76.7380 }
    },
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
    ],
    upvotes: 5,
    comments: []
  },
  {
    id: 5,
    title: "Damaged Playground Equipment",
    description: "Swing set chain is broken and poses safety risk to children.",
    category: "Parks & Recreation",
    status: "Open",
    priority: "High",
    reportedBy: "Maria Garcia",
    reportedAt: "2024-01-14T13:30:00Z",
    location: {
      address: "Riverside Park Playground",
      coordinates: { lat: 30.7330, lng: 76.7410 }
    },
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400"
    ],
    upvotes: 22,
    comments: [
      {
        id: 1,
        author: "Lisa Chen",
        text: "My kids love this playground. Please fix this soon!",
        timestamp: "2024-01-15T08:00:00Z"
      }
    ]
  }
];

// Categories for issue submission
export const issueCategories = [
  "Road Infrastructure",
  "Public Safety",
  "Waste Management",
  "Vandalism",
  "Parks & Recreation",
  "Water & Utilities",
  "Public Transportation",
  "Noise Complaints",
  "Environmental Issues",
  "Other"
];

// Priority levels
export const priorityLevels = ["Low", "Medium", "High", "Critical"];

// Status options
export const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

// Utility functions
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'Open': 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

// Mock API functions
export const submitIssue = async (issueData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newIssue = {
    id: Date.now(),
    ...issueData,
    status: 'Open',
    reportedAt: new Date().toISOString(),
    upvotes: 0,
    comments: []
  };
  
  console.log('Issue submitted:', newIssue);
  return { success: true, issue: newIssue };
};

export const getIssues = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockIssues;
};

export const getIssueById = async (id) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockIssues.find(issue => issue.id === parseInt(id));
};
