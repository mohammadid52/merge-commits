import React from 'react';
import {useEffect, useRef} from 'react';
import {createMap} from 'maplibre-gl-js-amplify';
import 'maplibre-gl/dist/maplibre-gl.css';
// const api = 'AIzaSyDcwGyRxRbcNGWOFQVT87A1mkxEOfm8t0w';

async function initializeMap() {
  const map = await createMap({
    container: 'map', // An HTML Element or HTML element ID to render the map in https://maplibre.org/maplibre-gl-js-docs/api/map/
    center: [-73.98597609730648, 40.751874635721734], // center in New York
    zoom: 11,
  });
  return map;
}

const EventMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = initializeMap();
  }, []);

  return <div ref={mapRef} id="map"></div>;
};

export default EventMap;
