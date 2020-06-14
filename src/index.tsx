import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
// import Amplify, { Auth } from 'aws-amplify';
// import awsconfig from './aws-exports';
// Amplify.configure(awsconfig);

import './style/style.css';
import './index.html';

const Page: React.FC = () => {
    return (
        <App />
    )
}

ReactDOM.render(<Page />, document.getElementById('app'));