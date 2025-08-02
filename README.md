# Civic Issue Reporting App

A React-based web application for reporting and tracking civic issues in your community. This app allows citizens to report problems like potholes, broken streetlights, waste management issues, and more.

## Features

### 🔐 Authentication System
- **Login Page**: Simple email/password authentication
- **Signup Page**: User registration with form validation
- **Protected Routes**: Secure access to authenticated areas
- **Mock Authentication**: Demo-ready with placeholder backend calls

### 📊 Dashboard
- **Issue Overview**: Display all reported civic issues
- **Statistics Cards**: Real-time stats (Total, Open, In Progress, Resolved)
- **Filtering**: Filter issues by status (All, Open, In Progress, Resolved)
- **Search**: Search issues by title, description, or category
- **Interactive List**: Click on any issue to view detailed information

### 📝 Issue Submission
- **Comprehensive Form**: Title, description, and category selection
- **Photo Upload**: Upload up to 3 photos with preview
- **Location Integration**: GPS location detection and manual address input
- **Anonymous Reporting**: Option to submit issues anonymously
- **Form Validation**: Client-side validation with error handling

### 🗺️ Map Integration
- **GPS Location**: Automatic current location detection
- **Manual Pin Placement**: Allow users to manually set issue location
- **Location Display**: Show coordinates and address information
- **Mock Map Interface**: Placeholder for real map implementation

### 📱 Issue Details
- **Detailed View**: Comprehensive issue information display
- **Image Gallery**: View uploaded photos with modal popup
- **Comments System**: Community discussion on issues
- **Voting System**: Upvote important issues
- **Status Tracking**: Monitor issue progress
- **Action Buttons**: Share, contact authorities, report inappropriate content

## Technology Stack

- **Frontend**: React 18+ with functional components and hooks
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Context API for authentication
- **Mock Data**: JSON-based mock API responses
- **Icons**: Heroicons (included via Tailwind)

## Project Structure

```
src/
├── components/
│   ├── Login.js              # Login page component
│   ├── Signup.js             # Registration page component
│   ├── Dashboard.js          # Main dashboard with issues list
│   ├── IssueSubmission.js    # Issue reporting form
│   ├── IssueDetail.js        # Detailed issue view
│   └── Navbar.js             # Navigation component
├── context/
│   └── AuthContext.js        # Authentication state management
├── data/
│   └── mockData.js           # Mock data and API functions
├── App.js                    # Main app component with routing
├── index.js                  # React DOM render
└── index.css                 # Tailwind CSS imports
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd civic-issue-reporting-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Credentials
Since this is a demo app with mock authentication, you can use any email and password combination to log in or create an account.

## Features Demo

### 1. Authentication Flow
- Visit the login page
- Enter any email/password (e.g., `user@example.com` / `password123`)
- Automatic redirect to dashboard after successful login
- Try the signup flow with form validation

### 2. Dashboard Features
- View the statistics cards showing issue counts
- Use the filter buttons to filter by status
- Search for specific issues using the search bar
- Click on any issue to view details

### 3. Issue Reporting
- Click "Report New Issue" from the dashboard
- Fill out the comprehensive form
- Upload photos (up to 3)
- Use "Get Current Location" for GPS coordinates
- Toggle anonymous reporting
- Submit and see success confirmation

### 4. Issue Details
- Click on any issue from the dashboard
- View comprehensive details, photos, and comments
- Use the upvote feature
- View location information
- Navigate back to dashboard

## Customization Options

### Adding Real Map Integration
Replace the mock map implementation with:
- **Google Maps**: `@googlemaps/react-wrapper`
- **Mapbox**: `react-map-gl`
- **OpenStreetMap**: `react-leaflet`

### Backend Integration
Replace mock API calls in `src/data/mockData.js` with real endpoints:
- Authentication API
- Issues CRUD operations
- File upload service
- User management

### Styling Customization
The app uses Tailwind CSS. Customize by:
- Modifying `tailwind.config.js`
- Updating color schemes in components
- Adding custom CSS classes

### Additional Features
Extend the app with:
- Real-time notifications
- Email alerts for issue updates
- Admin dashboard for authorities
- Mobile app using React Native
- Progressive Web App (PWA) features

## Mock Data Structure

The app includes comprehensive mock data with:
- **5 sample issues** with different statuses and categories
- **Multiple categories**: Road Infrastructure, Public Safety, Waste Management, etc.
- **Comments and voting system**
- **Location data** with coordinates
- **Image URLs** for demonstration

## Production Considerations

Before deploying to production:

1. **Replace mock authentication** with real user management
2. **Implement proper backend** with database storage
3. **Add real map integration** with geocoding services
4. **Implement file upload** to cloud storage
5. **Add proper error handling** and loading states
6. **Include accessibility features** (ARIA labels, keyboard navigation)
7. **Optimize for mobile** devices and different screen sizes
8. **Add proper security measures** (CSRF protection, input sanitization)

## Contributing

This is a demo/template project. To extend it:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Test thoroughly
5. Submit a pull request

## License

This project is created as a demo template and is available for educational and development purposes.

## Support

For questions or issues with this demo app:
- Check the component documentation
- Review the mock data structure
- Examine the routing configuration
- Test with the provided demo credentials

---

**Built with React + Tailwind CSS** | **Demo Ready** | **Fully Responsive**
