import React, { useState, useEffect } from 'react';
import { logoutUser } from '../services/authService';
import { locationService, Driver } from '../services/locationService';
import { 
  LogOut, 
  Plus, 
  Play, 
  Square, 
  User, 
  Phone, 
  MapPin,
  Navigation,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

const DriverDashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [showNewDriverForm, setShowNewDriverForm] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverNumber, setNewDriverNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = locationService.subscribeToDrivers((driversList) => {
      setDrivers(driversList);
      setLoading(false);
    });

    // Fallback: if listener doesn't return data within 3 seconds, stop loading spinner
    const timeout = setTimeout(() => setLoading(false), 3000);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (isTracking) {
      locationService.stopLocationTracking();
    }
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const newDriver: Driver = {
      id: Date.now().toString(),
      name: newDriverName.trim(),
      number: newDriverNumber.trim()
    };

    try {
      await locationService.saveDriver(newDriver);
      setNewDriverName('');
      setNewDriverNumber('');
      setShowNewDriverForm(false);
      setError('');
    } catch (error) {
      setError('Failed to save driver. Please try again.');
    }
  };

  const handleStartTracking = async () => {
    if (!selectedDriver) {
      setError('Please select a driver first');
      return;
    }

    try {
      setError('');
      await locationService.startLocationTracking(selectedDriver);
      setIsTracking(true);
    } catch (error: any) {
      setError(error.message || 'Failed to start location tracking');
    }
  };

  const handleStopTracking = () => {
    locationService.stopLocationTracking();
    setIsTracking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Driver Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver Selection */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Select Driver Profile
                </h2>
                <button
                  onClick={() => setShowNewDriverForm(true)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Driver</span>
                </button>
              </div>

              {/* Driver List */}
              <div className="space-y-3 mb-6">
                {drivers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No drivers registered</p>
                    <p className="text-sm text-gray-500 mt-1">Add a new driver to get started</p>
                  </div>
                ) : (
                  drivers.map((driver) => (
                    <div
                      key={driver.id}
                      onClick={() => setSelectedDriver(driver)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedDriver?.id === driver.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{driver.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Phone className="w-4 h-4 mr-1" />
                            {driver.number}
                          </p>
                        </div>
                        {selectedDriver?.id === driver.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* New Driver Form */}
              {showNewDriverForm && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Driver</h3>
                  <form onSubmit={handleAddDriver} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driver Name
                      </label>
                      <input
                        type="text"
                        value={newDriverName}
                        onChange={(e) => setNewDriverName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter driver name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={newDriverNumber}
                        onChange={(e) => setNewDriverNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        Save Driver
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewDriverForm(false);
                          setNewDriverName('');
                          setNewDriverNumber('');
                          setError('');
                        }}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Location Tracking */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location Tracking
              </h2>

              {selectedDriver ? (
                <div className="space-y-6">
                  {/* Selected Driver Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Selected Driver</h3>
                    <p className="text-lg font-semibold text-blue-600">{selectedDriver.name}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedDriver.number}
                    </p>
                  </div>

                  {/* Tracking Status */}
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isTracking ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Navigation className={`w-8 h-8 ${isTracking ? 'text-green-500' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-lg font-medium ${isTracking ? 'text-green-600' : 'text-gray-600'}`}>
                      {isTracking ? 'Location Sharing Active' : 'Location Sharing Inactive'}
                    </p>
                    {isTracking && (
                      <p className="text-sm text-gray-500 mt-1">
                        Updating location every 5 seconds
                      </p>
                    )}
                  </div>

                  {/* Control Button */}
                  <div className="pt-4">
                    {!isTracking ? (
                      <button
                        onClick={handleStartTracking}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <Play className="w-5 h-5" />
                        <span>Start Sharing Location</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopTracking}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <Square className="w-5 h-5" />
                        <span>Stop Sharing Location</span>
                      </button>
                    )}
                  </div>

                  {isTracking && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Note:</strong> Keep this tab open to continue sharing your location. 
                        Students can now track the bus in real-time.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Select a driver profile to start tracking</p>
                  <p className="text-sm text-gray-500 mt-1">Choose from the list or add a new driver</p>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DriverDashboard;