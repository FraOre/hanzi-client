import { FunctionComponent } from 'react';
import './App.css';
import useUserContext from './hooks/useUserContext';
// import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import { ApplicationProvider } from './contexts/ApplicationContext';
import Admin from './components/admin/Admin';
import { Routes,Route } from 'react-router-dom';
import CharactersList from './components/admin/characters/List';
import RandomHanzi from './components/widgets/RandomHanzi';

import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import CharactersImport from './components/admin/characters/Import';
import Info from './components/info/Info';

const App: FunctionComponent = () => {
    const { user } = useUserContext();
    const { isLoggedIn, isAdmin } = user;

    if (!isLoggedIn) {
        return (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path='/' element={
                <ApplicationProvider>
                    <h1>Random Hanzi</h1>
                    <RandomHanzi />
                </ApplicationProvider>
            } />
            {isLoggedIn && <>
                <Route path="/info" element={<Info />} />
                <Route path="/characters" element={<CharactersList />} />
            </>}
            {isLoggedIn && isAdmin && <>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/characters" element={<CharactersList />} />
                <Route path="/admin/characters/import" element={<CharactersImport />} />
            </>}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default App;
