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
    <div className="p-8 border shadow-xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/20">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-500 rounded-full shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Student Login</h2>
        <p className="text-gray-600">Sign in with your BIT Mesra Google account</p>
      </div>

      {/* Email Format Requirements */}
      <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="mb-2 text-sm font-semibold text-blue-800">Required Email Format</h3>
            <div className="space-y-1 text-sm text-blue-700">
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
        <div className="flex items-start p-4 mb-6 space-x-3 border border-red-200 rounded-lg bg-red-50">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-600">Authentication Failed</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
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
      <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="mb-2 text-sm font-semibold text-green-800">Secure Authentication</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Automatic email domain verification</li>
              <li>• Student information extraction</li>
              <li>• Secure session management</li>
              <li>• No password required</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2 text-sm text-center text-gray-600">
        <p>
          <strong>Important:</strong> You must use your official BIT Mesra Google account
        </p>
        <p>
          If you don't have access to your institutional email, please contact the IT department
        </p>
      </div>

      {/* Demo Information */}
      <div className="pt-6 mt-6 border-t border-gray-200">
        <p className="mb-3 text-sm text-center text-gray-600">Demo Information</p>
        <div className="p-3 text-center rounded-lg bg-gray-50">
          <p className="text-xs text-gray-500">Demo Email Format:</p>
          <p className="font-mono text-sm text-gray-700">{DEMO_ACCOUNTS.student.email}</p>
          <p className="mt-1 text-xs text-gray-500">{DEMO_ACCOUNTS.student.note}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;