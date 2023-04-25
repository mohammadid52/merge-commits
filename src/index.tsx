import {Amplify, Auth} from 'aws-amplify';
// @ts-ignore
import awsconfig from 'aws-exports';

import App from 'components/App';
import {createRoot} from 'react-dom/client';
import 'style/style.css';
import 'style/style.scss';

// dtsdf
Amplify.configure(awsconfig);

Auth.configure(awsconfig);

const root = createRoot(document.getElementById('app')!);

root.render(<App />);
