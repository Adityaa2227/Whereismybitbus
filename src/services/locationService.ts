import { ref, set, onValue, off } from 'firebase/database';
import { database } from './firebase';

export interface BusLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  driverName: string;
  driverNumber: string;
}

export interface Driver {
  id: string;
  name: string;
  number: string;
}

export class LocationService {
  private watchId: number | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  // Start tracking location for driver
  startLocationTracking(driver: Driver): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: BusLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            driverName: driver.name,
            driverNumber: driver.number
          };

          this.updateLocationInFirebase(location);
          resolve();
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        options
      );

      // Also update every 5 seconds with the last known position
      this.updateInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: BusLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
              driverName: driver.name,
              driverNumber: driver.number
            };
            this.updateLocationInFirebase(location);
          },
          (error) => console.error('Position update error:', error),
          options
        );
      }, 5000);
    });
  }

  // Stop tracking location
  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Update location in Firebase
  private async updateLocationInFirebase(location: BusLocation): Promise<void> {
    try {
      const locationRef = ref(database, 'busLocation');
      await set(locationRef, location);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  }

  // Subscribe to location updates
  subscribeToLocationUpdates(callback: (location: BusLocation | null) => void): () => void {
    const locationRef = ref(database, 'busLocation');
    
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });

    // Return unsubscribe function
    return () => off(locationRef);
  }

  // Save driver to Firebase
  async saveDriver(driver: Driver): Promise<void> {
    try {
      const driverRef = ref(database, `drivers/${driver.id}`);
      await set(driverRef, driver);
    } catch (error) {
      console.error('Error saving driver:', error);
      throw error;
    }
  }

  // Get all drivers
  subscribeToDrivers(callback: (drivers: Driver[]) => void): () => void {
    const driversRef = ref(database, 'drivers');
    
    onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      const drivers: Driver[] = data ? Object.values(data) : [];
      callback(drivers);
    });

    return () => off(driversRef);
  }
}

export const locationService = new LocationService();