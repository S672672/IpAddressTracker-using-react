import React, { useState, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './App.css';

const containerStyle = {
  width: '100%',
  height: '300px',
  marginTop: '20px',
};

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const mapRef = useRef(null);

  const handleInputChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://api.ipstack.com/${ipAddress}?access_key=YOUR_API_KEY`);
      const { latitude, longitude } = response.data;

      setLocationData(response.data);

      // Update the map position and marker
      if (mapRef.current) {
        mapRef.current.panTo({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat: latitude, lng: longitude });
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  return (
    <div className="App">
      <h1>IP Address Tracker</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter IP address"
          value={ipAddress}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {locationData && (
        <div className="location-info">
          <h2>Location Information:</h2>
          <p>IP Address: {locationData.ip}</p>
          <p>Country: {locationData.country_name}</p>
          <p>Region: {locationData.region_name}</p>
          <p>City: {locationData.city}</p>
          <p>Latitude: {locationData.latitude}</p>
          <p>Longitude: {locationData.longitude}</p>
        </div>
      )}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition || { lat: 0, lng: 0 }}
          zoom={markerPosition ? 10 : 2}
          ref={mapRef}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
