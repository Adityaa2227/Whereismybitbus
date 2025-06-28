import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { logoutUser } from '../services/authService';
import { locationService, BusLocation } from '../services/locationService';
import { Phone, LogOut, MapPin, Clock, User } from 'lucide-react';
import BusMap from '../components/BusMap';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

const StudentDashboard: React.FC = () => {
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Fetching address…');
  const prevCoordsRef = React.useRef<{lat:number;lng:number}|null>(null);

  useEffect(() => {
    // ask for notification permission once
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = locationService.subscribeToLocationUpdates((location) => {
      setBusLocation(location);
      setLastUpdated(Date.now());

      // If coordinates actually changed, fetch address and notify.
      if (!prevCoordsRef.current || prevCoordsRef.current.lat !== location.latitude || prevCoordsRef.current.lng !== location.longitude) {
        prevCoordsRef.current = { lat: location.latitude, lng: location.longitude };
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setAddress(data.display_name);
              toast.success(`Bus moved to: ${data.display_name}`);
            }
          })
          .catch(err => {
            console.error('Reverse geocode error', err);
            setAddress('Address unavailable');
          });
      }
    });

    // Show the map even if no location data has arrived yet
    setLoading(false);

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getTimeSinceUpdate = () => {
    if (!busLocation || !lastUpdated) return 'Never';
    const seconds = Math.floor((Date.now() - busLocation.timestamp) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hours ago`;
  };

  const handleCallDriver = () => {
    if (busLocation?.driverNumber) {
      window.open(`tel:${busLocation.driverNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
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
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Live Bus Location</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Updated {getTimeSinceUpdate()}</span>
                  </div>
                </div>
                
                {loading ? (
                  <div className="h-96 flex items-center justify-center bg-gray-50 rounded-xl">
                    <LoadingSpinner text="Loading bus location..." />
                  </div>
                ) : (
                  <div className="h-96 rounded-xl overflow-hidden">
                    <BusMap location={busLocation} />
                  </div>
                )}
              </div>
            </div>

            {/* Driver Info Section */}
            <div className="space-y-6">
              {/* Driver Details Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Driver Information
                </h3>
                
                {busLocation ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Driver Name</p>
                      <p className="text-lg font-medium text-gray-900">{busLocation.driverName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Contact Number</p>
                      <p className="text-lg font-medium text-gray-900">{busLocation.driverNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Last Update</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(busLocation.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    {address && (
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">{address}</p>
                    )}

                    {/* Contact Button */}
                    <div className="pt-4">
                      <button
                        onClick={handleCallDriver}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Call Driver</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No bus location available</p>
                    <p className="text-sm text-gray-500 mt-1">Waiting for driver to start sharing location...</p>
                  </div>
                )}
              </div>

              {/* Status Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bus Status</h3>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${busLocation ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className={`font-medium ${busLocation ? 'text-green-600' : 'text-gray-600'}`}>
                    {busLocation ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {busLocation && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Location updates every 5 seconds</p>
                    <p className="mt-1">Last seen: {getTimeSinceUpdate()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;