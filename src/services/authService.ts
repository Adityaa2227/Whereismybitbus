import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  User,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, googleProvider, database } from './firebase';

export interface AuthUser extends User {
  userType?: 'student' | 'driver';
}

// BIT Mesra email validation
export const validateBITMesraEmail = (email: string): { isValid: boolean; error?: string } => {
  const bitMesraPattern = /^btech\d{5}\.\d{2}@bitmesra\.ac\.in$/;
  
  if (!bitMesraPattern.test(email)) {
    return {
      isValid: false,
      error: 'Please use your official BIT Mesra email in the format: btechXXXXX.YY@bitmesra.ac.in'
    };
  }
  
  return { isValid: true };
};

// Extract student info from BIT Mesra email
export const extractStudentInfo = (email: string) => {
  const match = email.match(/^btech(\d{5})\.(\d{2})@bitmesra\.ac\.in$/);
  if (match) {
    return {
      rollNumber: match[1],
      batchYear: match[2],
      fullBatch: `20${match[2]}`
    };
  }
  return null;
};

// Password validation for drivers
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Create demo driver account if it doesn't exist
export const createDemoDriverAccount = async (): Promise<void> => {
  try {
    const demoEmail = DEMO_ACCOUNTS.driver.email;
    const demoPassword = DEMO_ACCOUNTS.driver.password;
    
    // Try to create the demo driver account
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
      const user = userCredential.user;
      
      // Set up the driver profile in the database
      await set(ref(database, `users/${user.uid}`), {
        email: demoEmail,
        name: 'Demo Driver',
        userType: 'driver',
        createdAt: Date.now(),
        lastLogin: Date.now()
      });
      
      console.log('Demo driver account created successfully');
      
      // Sign out after creating the account
      await signOut(auth);
    } catch (createError: any) {
      // If account already exists, just ensure the database entry exists
      if (createError.code === 'auth/email-already-in-use') {
        console.log('Demo driver account already exists, checking database entry...');
        
        // Try to sign in to get the user ID and ensure database entry exists
        try {
          const userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
          const user = userCredential.user;
          
          // Check if database entry exists
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (!snapshot.exists()) {
            // Create the database entry
            await set(userRef, {
              email: demoEmail,
              name: 'Demo Driver',
              userType: 'driver',
              createdAt: Date.now(),
              lastLogin: Date.now()
            });
            console.log('Demo driver database entry created');
          } else {
            // Ensure userType is set correctly
            const userData = snapshot.val();
            if (userData.userType !== 'driver') {
              await set(ref(database, `users/${user.uid}/userType`), 'driver');
              console.log('Demo driver userType updated');
            }
          }
          
          // Sign out after setup
          await signOut(auth);
        } catch (signInError) {
          console.error('Error setting up existing demo account:', signInError);
        }
      } else {
        throw createError;
      }
    }
  } catch (error: any) {
    console.error('Error in createDemoDriverAccount:', error);
    // Don't throw the error to prevent blocking the UI
  }
};

// Student Google OAuth login with BIT Mesra email validation
export const loginStudentWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user as AuthUser;
    
    if (!user.email) {
      await signOut(auth);
      throw new Error('No email found in Google account.');
    }
    
    const emailValidation = validateBITMesraEmail(user.email);
    if (!emailValidation.isValid) {
      await signOut(auth);
      throw new Error(emailValidation.error || 'Invalid email format. Please use your official BIT Mesra email address.');
    }
    
    user.userType = 'student';
    
    // Extract student information
    const studentInfo = extractStudentInfo(user.email);
    
    // Store user info in database
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      name: user.displayName,
      userType: 'student',
      rollNumber: studentInfo?.rollNumber,
      batchYear: studentInfo?.batchYear,
      fullBatch: studentInfo?.fullBatch,
      lastLogin: Date.now()
    });
    
    return user;
  } catch (error: any) {
    console.error('Google login error:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up was blocked by your browser. Please:\n\n1. Look for a pop-up blocker icon in your address bar and click it\n2. Select "Always allow pop-ups from this site"\n3. Refresh the page and try signing in again\n\nAlternatively, disable your pop-up blocker temporarily for this site.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another sign-in attempt is in progress. Please wait and try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else if (error.code === 'auth/api-key-not-valid') {
      throw new Error('Firebase configuration error. Please ensure your Firebase API key is properly configured in the environment variables.');
    }
    throw error;
  }
};

// Driver traditional login
export const loginDriver = async (
  email: string, 
  password: string, 
  rememberMe: boolean = false
): Promise<AuthUser> => {
  try {
    // Set persistence based on remember me option
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user as AuthUser;
    
    // Check if this is the demo account and create database entry if needed
    if (email === DEMO_ACCOUNTS.driver.email) {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Create the driver profile in database
        await set(userRef, {
          email: email,
          name: 'Demo Driver',
          userType: 'driver',
          createdAt: Date.now(),
          lastLogin: Date.now()
        });
        console.log('Demo driver database entry created during login');
      } else {
        // Update existing profile to ensure userType is set
        const userData = snapshot.val();
        if (!userData.userType || userData.userType !== 'driver') {
          await set(ref(database, `users/${user.uid}/userType`), 'driver');
          console.log('Demo driver userType updated during login');
        }
        await set(ref(database, `users/${user.uid}/lastLogin`), Date.now());
      }
      
      user.userType = 'driver';
      return user;
    }
    
    // For non-demo accounts, verify this is a driver account
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    
    if (!userData) {
      await signOut(auth);
      throw new Error('Driver account not found in database. Please contact administrator to set up your driver profile.');
    }
    
    if (userData.userType !== 'driver') {
      await signOut(auth);
      throw new Error('This account is not registered as a driver. Please use the correct driver credentials.');
    }
    
    user.userType = 'driver';
    
    // Update last login
    await set(ref(database, `users/${user.uid}/lastLogin`), Date.now());
    
    return user;
  } catch (error: any) {
    console.error('Driver login error:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('Driver email not found. Please check your email address or contact administrator.');
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later or reset your password.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format. Please enter a valid email address.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else if (error.code === 'auth/api-key-not-valid') {
      throw new Error('Firebase configuration error. Please ensure your Firebase API key is properly configured in the environment variables.');
    }
    throw error;
  }
};

// Password recovery for drivers
export const resetDriverPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('Driver email not found.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format.');
    }
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Demo accounts for testing
export const DEMO_ACCOUNTS = {
  student: {
    email: 'btech15011.23@bitmesra.ac.in',
    note: 'Use Google OAuth with this email'
  },
  driver: {
    email: 'demodriver@bitbus.com',
    password: 'DemoDriver@123'
  }
};