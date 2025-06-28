import React, { useState } from 'react';
import { Bus, Users, ArrowRight, Chrome, Shield } from 'lucide-react';
import StudentLogin from '../components/StudentLogin';
import DriverLogin from '../components/DriverLogin';
import Footer from '../components/Footer';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedType, setSelectedType] = useState<'student' | 'driver' | null>(null);

  if (selectedType) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center flex-1 px-4 py-12">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <button
              onClick={() => setSelectedType(null)}
              className="flex items-center mb-6 text-gray-600 transition-colors duration-200 hover:text-gray-900"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              <span>Back to selection</span>
            </button>

            {selectedType === 'student' ? (
              <StudentLogin onLogin={onLogin} />
            ) : (
              <DriverLogin onLogin={onLogin} />
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-blue-500 rounded-full shadow-xl">
              <Bus className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Where is My BIT Bus</h1>
            <p className="mb-2 text-xl text-gray-600">Track your bus in real-time</p>
            <p className="text-gray-500">Choose your login type to continue</p>
          </div>

          {/* Login Type Selection */}
          <div className="grid max-w-2xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
            {/* Student Login Card */}
            <div
              onClick={() => setSelectedType('student')}
              className="group bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 transition-colors duration-300 bg-blue-500 rounded-full shadow-lg group-hover:bg-blue-600">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Student Login</h2>
                <p className="mb-6 text-gray-600">
                  Sign in with your BIT Mesra Google account to track the bus location
                </p>
                <div className="p-4 mb-6 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-center mb-2 space-x-2">
                    <Chrome className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Google OAuth Only</p>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Real-time bus tracking</li>
                    <li>• Driver contact information</li>
                    <li>• Secure institutional login</li>
                  </ul>
                </div>
                <div className="p-3 mb-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      BIT Mesra Email Required
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center text-blue-500 transition-colors duration-300 group-hover:text-blue-600">
                  <span className="font-medium">Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Driver Login Card */}
            <div
              onClick={() => setSelectedType('driver')}
              className="group bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 transition-colors duration-300 bg-orange-500 rounded-full shadow-lg group-hover:bg-orange-600">
                  <Bus className="w-8 h-8 text-white" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Driver Login</h2>
                <p className="mb-6 text-gray-600">
                  Sign in with your driver credentials to share your location with students
                </p>
                <div className="p-4 mb-6 rounded-lg bg-orange-50">
                  <p className="mb-2 text-sm font-medium text-orange-800">Traditional Login</p>
                  <ul className="space-y-1 text-sm text-orange-700">
                    <li>• Location sharing controls</li>
                    <li>• Driver profile management</li>
                    <li>• Real-time tracking</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center text-orange-500 transition-colors duration-300 group-hover:text-orange-600">
                  <span className="font-medium">Sign in with credentials</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;