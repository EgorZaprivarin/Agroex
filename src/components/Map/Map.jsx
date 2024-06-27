import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ location }) => {
  const [latitude, setLatitude] = useState(null );
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    getCoordinatesByCityName(location).then(({ latitude, longitude }) => {
      setLatitude(latitude);
      setLongitude(longitude);
    });
  }, [latitude, longitude]);

   const getCoordinatesByCityName = async (cityName) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        return { latitude, longitude };
      } else {
        console.log('Геокодирование не удалось для указанного города');
      }
    } catch (error) {
      console.error('Ошибка при получении координат', error);
    }
  }

  return (
    <>
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[latitude, longitude]}>
            <Popup>
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
};

export default Map;
