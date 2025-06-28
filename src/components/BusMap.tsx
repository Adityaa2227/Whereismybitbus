import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BusLocation } from '../services/locationService';

// Inline yellow bus SVG is used instead of external image
const BUS_ICON_URL = '';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BusMapProps {
  location: BusLocation | null;
  className?: string;
}

const BusMap: React.FC<BusMapProps> = ({ location, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([25.5961, 85.0876], 15); // Default to BIT Patna Main Gate

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Custom bus icon
    const busIcon = L.divIcon({
      html: `<div style="width:32px;height:32px;background:#fbbf24;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.3);">
                <svg width="16" height="16" fill="white" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v6H4V6zm2 1a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                </svg>
             </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Add marker
    if (location) {
      const marker = L.marker([location.latitude, location.longitude], { icon: busIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-center">
            <strong>Bus Location</strong><br/>
            Driver: ${location.driverName}<br/>
            <small>Updated: ${new Date(location.timestamp).toLocaleTimeString()}</small>
          </div>
        `);
      
      markerRef.current = marker;
      map.setView([location.latitude, location.longitude], 15);
    } else {
      // Placeholder gray bus icon at default center
      const placeholderIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:#fde047;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;opacity:0.6;">
                  <svg width="14" height="14" fill="white" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v6H4V6zm2 1a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                  </svg>
               </div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([25.5961, 85.0876], { icon: placeholderIcon })
        .addTo(map)
        .bindPopup('<div class="text-center">Bus location not available</div>');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !location) return;

    const busIcon = L.divIcon({
      html: `<div style="width:32px;height:32px;background:#fbbf24;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.3);">
                <svg width="16" height="16" fill="white" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v6H4V6zm2 1a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                </svg>
             </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      markerRef.current.setIcon(busIcon);
      markerRef.current.setPopupContent(`
        <div class="text-center">
          <strong>Bus Location</strong><br/>
          Driver: ${location.driverName}<br/>
          <small>Updated: ${new Date(location.timestamp).toLocaleTimeString()}</small>
        </div>
      `);
    } else {
      const marker = L.marker([location.latitude, location.longitude], { icon: busIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="text-center">
            <strong>Bus Location</strong><br/>
            Driver: ${location.driverName}<br/>
            <small>Updated: ${new Date(location.timestamp).toLocaleTimeString()}</small>
          </div>
        `);
      
      markerRef.current = marker;
    }

    // Center map on new location with smooth animation
    mapInstanceRef.current.setView([location.latitude, location.longitude], 15, {
      animate: true,
      duration: 1
    });
  }, [location]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full rounded-xl overflow-hidden shadow-lg ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default BusMap;