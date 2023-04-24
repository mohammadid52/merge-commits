import Loader from '@components/Atoms/Loader';
import L from 'leaflet';

import {useEffect, useState} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';

const linkBlockForMap = `
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
    crossOrigin=""
    id="leaflet-css"
  />
`;

const addLinkBlock = () => {
  if (document.getElementById('leaflet-css')) return;
  const range = document.createRange();
  const fragment = range.createContextualFragment(linkBlockForMap);
  document.head.appendChild(fragment);
};

const GraphMap = ({markers}: {markers: any[]}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    addLinkBlock();

    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Generating map...." />
      </div>
    );
  }

  return (
    <MapContainer
      scrollWheelZoom={false}
      className="h-[60vh]"
      id={'map'}
      center={[29.76, -95.37]}
      zoom={9}
      maxZoom={18}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers}
    </MapContainer>
  );
};

export default GraphMap;
