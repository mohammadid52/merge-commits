import React, { useContext } from 'react';
import MainRouter from './AppMainRouter';
import { GlobalContextProvider } from '../contexts/GlobalContext';

const App: React.FC = () => {
    return (
        <GlobalContextProvider>
            <MainRouter />
        </GlobalContextProvider>
    )
}

export default App;

// export default withAuthenticator(App);