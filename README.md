# Where is My BIT Bus

A modern, fully responsive web application for real-time bus tracking with separate dashboards for students and drivers.

## Features

### Student Dashboard
- **Real-time Bus Tracking**: View live bus location on OpenStreetMap using Leaflet.js
- **Google OAuth Authentication**: Secure login with BIT Mesra institutional email
- **Driver Information**: Display driver name and contact details
- **Communication**: Direct call and WhatsApp integration with driver
- **Live Updates**: Location updates every 5 seconds from Firebase Realtime Database
- **Status Indicators**: Shows last update time and connection status

### Driver Dashboard
- **Driver Management**: Register and manage multiple driver profiles
- **Location Sharing**: Start/stop real-time location tracking
- **Profile Selection**: Choose from registered drivers or add new ones
- **Real-time Updates**: Automatic location updates every 5 seconds using browser geolocation

## Tech Stack

- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Maps**: Leaflet.js with OpenStreetMap
- **Authentication**: Firebase Authentication (Google OAuth for students, Email/Password for drivers)
- **Database**: Firebase Realtime Database
- **Icons**: Lucide React
- **Build Tool**: Vite

## Design Features

- **Modern UI**: Glassmorphism effects with soft shadows and blur
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Smooth Animations**: Page transitions, hover effects, and micro-interactions
- **Professional Typography**: Clean layouts with proper spacing and hierarchy
- **Loading States**: Skeleton components and spinners for better UX

## Setup Instructions

### 1. Environment Configuration

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Realtime Database
3. Copy your Firebase configuration to the `.env` file

### 3. Firebase Authentication Setup

#### For Students (Google OAuth):
1. Go to Authentication > Sign-in method
2. Enable Google authentication
3. Add your domain to authorized domains
4. Configure OAuth consent screen with BIT Mesra domain restriction

#### For Drivers (Email/Password):
1. Enable Email/Password authentication
2. Create driver accounts manually or through admin interface
3. Use format: `DRIVERXXX@driver.bit.internal` for driver emails

### 4. Firebase Realtime Database Setup

1. Go to Realtime Database and create a database
2. Set up security rules:

```json
{
  "rules": {
    "busLocation": {
      ".read": true,
      ".write": "auth != null"
    },
    "drivers": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 5. Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Authentication System

### Student Authentication
- **Google OAuth Only**: Students must use their BIT Mesra Google accounts
- **Email Validation**: Automatic validation of `btechXXXXX.YY@bitmesra.ac.in` format
- **Student Info Extraction**: Automatically extracts roll number and batch year
- **Secure Session**: Firebase handles all authentication securely

### Driver Authentication
- **Traditional Login**: Driver ID and password authentication
- **Password Requirements**: 8+ characters with uppercase, lowercase, number, and special character
- **Remember Me**: Optional persistent login for 30 days
- **Password Recovery**: Email-based password reset functionality

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Environment Variables**: Add your Firebase configuration to Vercel environment variables

### GitHub Integration

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

## Usage

### For Students
1. Click "Student Login" on the homepage
2. Sign in with your BIT Mesra Google account
3. View real-time bus location on the map
4. See driver information and contact details
5. Call or message the driver directly
6. Monitor last update time and connection status

### For Drivers
1. Click "Driver Login" on the homepage
2. Enter your driver credentials
3. Select or create a driver profile
4. Start location sharing to broadcast position
5. Keep the tab open for continuous tracking
6. Stop sharing when route is complete

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthGuard.tsx   # Authentication wrapper
│   ├── BusMap.tsx      # Leaflet map component
│   ├── Footer.tsx      # App footer
│   ├── LoadingSpinner.tsx
│   ├── StudentLogin.tsx # Student authentication
│   └── DriverLogin.tsx # Driver authentication
├── pages/              # Main application pages
│   ├── Login.tsx       # Authentication page
│   ├── StudentDashboard.tsx
│   └── DriverDashboard.tsx
├── services/           # Business logic and API calls
│   ├── firebase.ts     # Firebase configuration
│   ├── authService.ts  # Authentication logic
│   └── locationService.ts # Location tracking logic
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Security Considerations

- Firebase security rules configured for proper access control
- Google OAuth with domain restriction for students
- Password validation and secure storage for drivers
- Environment variables for sensitive configuration
- HTTPS required for geolocation in production

## Browser Compatibility

- Modern browsers with geolocation support
- HTTPS required for geolocation in production
- Mobile browsers supported
- Progressive Web App features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

Created by [Aditya](https://www.linkedin.com/in/adityaagarwal2003/)