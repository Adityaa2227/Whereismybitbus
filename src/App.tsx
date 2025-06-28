import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from './services/firebase';
import { AuthUser } from './services/authService';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import DriverDashboard from './pages/DriverDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('App: Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('App: Auth state changed', firebaseUser ? 'User logged in' : 'No user');
      
      if (firebaseUser) {
        const authUser = firebaseUser as AuthUser;
        console.log('App: Processing user:', {
          uid: authUser.uid,
          email: authUser.email
        });
        
        try {
          // Get user data from database to determine user type
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          
          console.log('App: User data from database:', userData);
          
          if (userData && userData.userType) {
            authUser.userType = userData.userType;
            console.log('App: User type from database:', userData.userType);
          } else {
            // Fallback: determine user type based on email
            console.log('App: No user type in database, determining from email:', firebaseUser.email);
            
            if (firebaseUser.email?.includes('@driver.bit.internal') || 
                firebaseUser.email?.includes('demodriver@bitbus.com')) {
              authUser.userType = 'driver';
            } else if (firebaseUser.email?.includes('@bitmesra.ac.in') || 
                       firebaseUser.email?.includes('@student.bit.edu') ||
                       firebaseUser.email?.includes('@bit.edu') ||
                       firebaseUser.email?.includes('@bit.ac.in')) {
              authUser.userType = 'student';
            } else {
              // Default to student for Google OAuth users
              authUser.userType = 'student';
            }
            
            console.log('App: Determined user type:', authUser.userType);
            
            // Update the database with the determined user type
            try {
              await set(ref(database, `users/${firebaseUser.uid}/userType`), authUser.userType);
              console.log('App: Updated user type in database');
            } catch (updateError) {
              console.error('App: Failed to update user type in database:', updateError);
            }
          }
          
          console.log('App: Final user object:', {
            uid: authUser.uid,
            email: authUser.email,
            userType: authUser.userType
          });
          
          setUser(authUser);
          setError('');
        } catch (error) {
          console.error('App: Error fetching user data:', error);
          
          // Fallback user type determination
          if (firebaseUser.email?.includes('@driver.bit.internal') || 
              firebaseUser.email?.includes('demodriver@bitbus.com')) {
            authUser.userType = 'driver';
          } else {
            authUser.userType = 'student';
          }
          
          console.log('App: Fallback user type:', authUser.userType);
          setUser(authUser);
          setError('');
        }
      } else {
        console.log('App: No authenticated user');
        setUser(null);
        setError('');
      }
      
      console.log('App: Setting loading to false');
      setLoading(false);
    });

    return () => {
      console.log('App: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Handle login from Login component
  const handleLogin = (loggedInUser: AuthUser) => {
    console.log('App: Login handler called with user:', {
      uid: loggedInUser.uid,
      email: loggedInUser.email,
      userType: loggedInUser.userType
    });
    setUser(loggedInUser);
    setError('');
  };

  console.log('App: Render state:', { loading, user: user ? 'present' : 'null', error });

  if (loading) {
    console.log('App: Rendering loading spinner');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner text="Loading application..." />
      </div>
    );
  }

  if (error) {
    console.log('App: Rendering error state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Application Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('App: Rendering login page');
    return <Login onLogin={handleLogin} />;
  }

  // Route based on user type
  console.log('App: Routing user with type:', user.userType);
  
  if (user.userType === 'student') {
    console.log('App: Rendering StudentDashboard');
    return <StudentDashboard />;
  } else if (user.userType === 'driver') {
    console.log('App: Rendering DriverDashboard');
    return <DriverDashboard />;
  } else {
    console.log('App: Unknown user type, defaulting to StudentDashboard');
    return <StudentDashboard />;
  }
}

export default App;