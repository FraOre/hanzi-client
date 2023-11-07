// import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
);
root.render(
    // <StrictMode>
        <UserProvider>
            <Router>
                <App />
            </Router>
        </UserProvider>
    // </StrictMode>
);
