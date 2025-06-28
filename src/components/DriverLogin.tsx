import React, { useState, useEffect } from 'react';
import { loginDriver, resetDriverPassword, validatePassword, createDemoDriverAccount, DEMO_ACCOUNTS } from '../services/authService';
import { Truck, Eye, EyeOff, AlertCircle, CheckCircle, Shield, Key, Mail } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface DriverLoginProps {
  onLogin: (user: any) => void;
}

const DriverLogin: React.FC<DriverLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [initializingDemo, setInitializingDemo] = useState(false);

  // Initialize demo account on first visit only to avoid auth redirects
  useEffect(() => {
    const alreadyInit = localStorage.getItem('demoDriverReady');
    if (alreadyInit === '1') return; // demo already ensured

    const initDemo = async () => {
      setInitializingDemo(true);
      try {
        await createDemoDriverAccount();
        localStorage.setItem('demoDriverReady', '1');
      } catch (error) {
        console.error('Demo initialization error:', error);
      } finally {
        setInitializingDemo(false);
      }
    };

    initDemo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginDriver(email, password, rememberMe);
      onLogin(user);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');

    try {
      await resetDriverPassword(resetEmail);
      setResetSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_ACCOUNTS.driver.email);
    setPassword(DEMO_ACCOUNTS.driver.password);
    setError('');
  };

  if (showForgotPassword) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 shadow-lg">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        {resetSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Reset Email Sent!</h3>
            <p className="text-gray-600">
              Check your email for password reset instructions.
            </p>
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetSuccess(false);
                setResetEmail('');
                setError('');
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Driver Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your driver email"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {resetLoading ? <LoadingSpinner size="sm" text="" /> : 'Send Reset Email'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setResetEmail('');
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 shadow-lg">
          <Truck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Login</h2>
        <p className="text-gray-600">Sign in to start sharing your location</p>
      </div>

      {initializingDemo && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
          <LoadingSpinner size="sm" text="" />
          <p className="text-blue-600 text-sm">Setting up demo account...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-600 text-sm font-medium">Login Failed</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Driver Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your driver email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Must be 8+ characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || initializingDemo}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : 'Sign In'}
        </button>
      </form>

      {/* Security Features */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-green-800 mb-2">Secure Driver Access</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Encrypted password authentication</li>
              <li>• Secure session management</li>
              <li>• Location data protection</li>
              <li>• Account verification required</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600 mb-3">Demo Account</p>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">Demo Email:</p>
            <p className="text-sm font-mono text-gray-700 break-all">{DEMO_ACCOUNTS.driver.email}</p>
            <p className="text-xs text-gray-500">Demo Password:</p>
            <p className="text-sm font-mono text-gray-700">{DEMO_ACCOUNTS.driver.password}</p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              disabled={initializingDemo}
              className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200 disabled:opacity-50"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;