// import Amplify from 'aws-amplify';
import Amplify from '@aws-amplify/core';
import React from 'react';
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

ReactDOM.render(<Page />, document.getElementById('app'));

// TODO merge atoms generals and stanards directory.
//
// increased node_env on aws
