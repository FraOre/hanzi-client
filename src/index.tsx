// import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from 'react';
import { MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
);

root.render(
    // <StrictMode>
        <UserProvider>
            <MantineProvider>    
                <Router>
                    <App />
                </Router>
            </MantineProvider>
        </UserProvider>
    // </StrictMode>
);
