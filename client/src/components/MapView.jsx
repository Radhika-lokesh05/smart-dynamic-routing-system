import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Custom Icons for better clarity
const StartIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const GoalIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const nodeCoords = {
  "MS Palya": [13.0886, 77.5512],
  "Sambhram College": [13.0825, 77.5441],
  "BEL Circle": [13.0361, 77.5562],
  "Jalahalli Cross": [13.0494, 77.5029],
  "Gangamma Circle": [13.0558, 77.5552],
  "Yeshwanthpur": [13.0235, 77.5565],
  "Jalahalli": [13.0538, 77.5458]
};

const MapRecenter = ({ path }) => {
  const map = useMap();
  React.useEffect(() => {
    if (path && path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [path, map]);
  return null;
};

const MapView = ({ routeData }) => {
  // Extract high-precision GPS coordinates from OSRM backend
  const bestRoute = routeData?.routes?.find(r => r.type === 'best');
  const activePath = bestRoute?.coordinates || 
                    bestRoute?.path?.map(nodeId => nodeCoords[nodeId]).filter(Boolean) || 
                    [];

  const center = activePath.length > 0 ? activePath[0] : [13.0538, 77.5458];
  
  // Dummy routes for visualization
  const routes = [
    {
      id: 'best',
      name: 'Optimal Path',
      color: '#10b981', // Green
      weight: 6,
      positions: [
        [13.0886, 77.5512],
        [13.0825, 77.5441],
        [13.0538, 77.5458]
      ]
    },
    {
      id: 'congestion',
      name: 'Congested Zone',
      color: '#ef4444', // Red
      weight: 8,
      positions: [
        [13.0361, 77.5562],
        [13.0558, 77.5552],
        [13.0538, 77.5458]
      ]
    },
    {
      id: 'alternative',
      name: 'Eco Alternative',
      color: '#3b82f6', // Blue
      weight: 4,
      dashArray: '10, 10',
      positions: [
        [13.0494, 77.5029],
        [13.0538, 77.5458]
      ]
    }
  ];

  return (
    <div className="glass-card" style={{ height: '600px', padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter path={activePath} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {routes.map(route => (
          <Polyline 
            key={route.id}
            positions={route.positions}
            pathOptions={{ 
              color: route.color, 
              weight: route.weight,
              dashArray: route.dashArray || null,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          >
            <Popup>
              <div style={{ color: '#000' }}>
                <strong>{route.name}</strong>
                <p>Status: {route.id === 'best' ? 'Recommended' : 'Active'}</p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Dynamic Active AI Route */}
        {activePath.length > 0 && (
          <>
            <Polyline 
              positions={activePath}
              pathOptions={{ 
                color: '#60a5fa', 
                weight: 12, 
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            >
              <Popup>
                <div style={{ color: '#000', padding: '4px' }}>
                  <div style={{ fontWeight: '900', fontSize: '1rem', marginBottom: '4px' }}>AI OPTIMIZED ROUTE</div>
                  <div style={{ fontWeight: 'bold' }}>⏱️ ETA: {bestRoute.time} min</div>
                  <div style={{ fontWeight: 'bold' }}>📍 Distance: {bestRoute.distance} km</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#666' }}>Traffic: {bestRoute.traffic}</div>
                </div>
              </Popup>
              <Tooltip permanent={true} direction="center" className="route-tooltip">
                <span style={{ fontWeight: 'bold', color: '#000' }}>{bestRoute.time} min</span>
              </Tooltip>
            </Polyline>
            <Marker position={activePath[0]} icon={StartIcon}>
              <Popup>
                <div style={{color: '#000'}}>
                  <strong style={{color: '#10b981'}}>STARTING POINT</strong>
                  <br/>{bestRoute.path[0]}
                </div>
              </Popup>
            </Marker>
            <Marker position={activePath[activePath.length - 1]} icon={GoalIcon}>
              <Popup>
                <div style={{color: '#000'}}>
                  <strong style={{color: '#ef4444'}}>DESTINATION</strong>
                  <br/>{bestRoute.path[bestRoute.path.length - 1]}
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {!activePath.length && (
          <Marker position={center}>
            <Popup>
              <span style={{ color: '#000' }}>You are here</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Overlay Controls */}
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '20px', 
        zIndex: 1000,
        background: 'var(--bg-secondary)',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
            <span>Best Route</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }}></div>
            <span>High Congestion</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#3b82f6', border: '1px dashed #fff', borderRadius: '2px' }}></div>
            <span>Alternatives</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
