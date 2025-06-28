import React, { useState } from 'react';
import { loginStudentWithGoogle, validateBITMesraEmail, extractStudentInfo, DEMO_ACCOUNTS } from '../services/authService';
import { GraduationCap, Chrome, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface StudentLoginProps {
  onLogin: (user: any) => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await loginStudentWithGoogle();
      onLogin(user);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Login</h2>
=======
    <div className="p-8 border shadow-xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/20">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-500 rounded-full shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Student Login</h2>
>>>>>>> 98f6374 (inital commit)
        <p className="text-gray-600">Sign in with your BIT Mesra Google account</p>
      </div>

      {/* Email Format Requirements */}
<<<<<<< HEAD
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Required Email Format</h3>
            <div className="text-sm text-blue-700 space-y-1">
=======
      <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="mb-2 text-sm font-semibold text-blue-800">Required Email Format</h3>
            <div className="space-y-1 text-sm text-blue-700">
>>>>>>> 98f6374 (inital commit)
              <p><strong>Format:</strong> btechXXXXX.YY@bitmesra.ac.in</p>
              <p><strong>Example:</strong> btech15011.23@bitmesra.ac.in</p>
              <div className="mt-2 text-xs">
                <p>• XXXXX: Your 5-digit roll number</p>
                <p>• YY: Your batch year (e.g., 23 for 2023)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
<<<<<<< HEAD
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-600 text-sm font-medium">Authentication Failed</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
=======
        <div className="flex items-start p-4 mb-6 space-x-3 border border-red-200 rounded-lg bg-red-50">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-600">Authentication Failed</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
>>>>>>> 98f6374 (inital commit)
          </div>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-gray-200 flex items-center justify-center space-x-3 mb-6"
      >
        {loading ? (
          <LoadingSpinner size="sm" text="" />
        ) : (
          <>
            <Chrome className="w-6 h-6 text-blue-500" />
            <span className="text-lg">Continue with Google</span>
          </>
        )}
      </button>

      {/* Security Features */}
<<<<<<< HEAD
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-green-800 mb-2">Secure Authentication</h3>
            <ul className="text-sm text-green-700 space-y-1">
=======
      <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="mb-2 text-sm font-semibold text-green-800">Secure Authentication</h3>
            <ul className="space-y-1 text-sm text-green-700">
>>>>>>> 98f6374 (inital commit)
              <li>• Automatic email domain verification</li>
              <li>• Student information extraction</li>
              <li>• Secure session management</li>
              <li>• No password required</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
<<<<<<< HEAD
      <div className="text-center text-sm text-gray-600 space-y-2">
=======
      <div className="space-y-2 text-sm text-center text-gray-600">
>>>>>>> 98f6374 (inital commit)
        <p>
          <strong>Important:</strong> You must use your official BIT Mesra Google account
        </p>
        <p>
          If you don't have access to your institutional email, please contact the IT department
        </p>
      </div>

<<<<<<< HEAD
      {/* Demo Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600 mb-3">Demo Information</p>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Demo Email Format:</p>
          <p className="text-sm font-mono text-gray-700">{DEMO_ACCOUNTS.student.email}</p>
          <p className="text-xs text-gray-500 mt-1">{DEMO_ACCOUNTS.student.note}</p>
        </div>
      </div>
=======
     
>>>>>>> 98f6374 (inital commit)
    </div>
  );
};

export default StudentLogin;