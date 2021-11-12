import React from 'react';
import {useEffect, useRef} from 'react';
import {createMap} from 'maplibre-gl-js-amplify';
import 'maplibre-gl/dist/maplibre-gl.css';
// const api = 'AIzaSyDcwGyRxRbcNGWOFQVT87A1mkxEOfm8t0w';

const EventMap = () => {
  const mapRef = useRef(null); // Reference to the map DOM element

  useEffect(() => {
    let map: any;
    async function initializeMap() {
      // We only want to initialize the underlying maplibre map after the div has been rendered
      if (mapRef.current != null) {
        map = await createMap({
          container: mapRef.current,
          center: [-122.431297, 37.773972],
          zoom: 11,
        });
      }
    }
    try {
      initializeMap();
    } catch (error) {
      console.error(error);
    }

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (map !== null) map.remove();
    };
  }, []);

  return <div ref={mapRef} id="map" />;
};

export default EventMap;
