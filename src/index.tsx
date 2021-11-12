// import Amplify from 'aws-amplify';
import Amplify from '@aws-amplify/core';
import {getBackendKey, getCorrectUrl} from '@utilities/urls_other';
import React, {useEffect} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import 'react-image-crop/lib/ReactCrop.scss';
import awsconfig from './aws-exports';
import App from './components/App';
import './index.html';
import './style/style.css';
import './style/style.scss';
Amplify.configure(awsconfig);

const Page: React.FC = () => {
  return <App />;
};

// const initMap = () => {
//   // The location of Uluru
//   const uluru = {lat: -25.344, lng: 131.036};
//   // The map, centered at Uluru
//   const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
//     zoom: 4,
//     center: uluru,
//   });

//   // The marker, positioned at Uluru
//   const marker = new google.maps.Marker({
//     position: uluru,
//     map: map,
//   });
// };

ReactDOM.render(<Page />, document.getElementById('app'));

// export {initMap};
// TODO merge atoms generals and stanards directory.
//
// increased node_env on aws
