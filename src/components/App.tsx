import React, { useContext } from 'react';
import MainRouter from './AppMainRouter';
import { ThemeContextProvider } from '../contexts/ThemeContext';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const App: React.FC = () => {
    return (
       <ThemeContextProvider>
            {/* <AmplifySignOut /> */}
            <MainRouter />
       </ThemeContextProvider>
    )
}

export default App;

// export default withAuthenticator(App);