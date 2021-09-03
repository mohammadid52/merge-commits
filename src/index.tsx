import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
// import Amplify from 'aws-amplify';
import Amplify from '@aws-amplify/core';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

import './style/style.css';
import './index.html';
import './style/style.scss';
import 'react-image-crop/lib/ReactCrop.scss';

const Page: React.FC = () => {
  return <App />;
};

ReactDOM.render(<Page />, document.getElementById('app'));

// TODO merge atoms generals and stanards directory.
//
// increased node_env on aws
