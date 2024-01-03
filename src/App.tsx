import { FunctionComponent } from 'react'
import './App.css'
import useUserContext from './hooks/useUserContext'
import PageNotFound from './components/PageNotFound'
import { ApplicationProvider } from './contexts/ApplicationContext'
import Admin from './components/admin/Admin'
import { Routes, Route } from 'react-router-dom'
import CharactersList from './components/admin/characters/List'
import RandomHanzi from './components/widget/RandomHanzi'
import CharactersImport from './components/admin/characters/Import'
import CharacterDetail from './components/admin/characters/Detail'
import Info from './components/info/Info'
import { CharacterFilterProvider } from './contexts/filter/CharacterFilterContext'
import '@mantine/core/styles.css'

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Header from './components/Header'
import Login from './components/Login'

export async function fetchApi<T>(
  url: string,
  parameters: AxiosRequestConfig = {}
) {
  // Chiamata API
  await axios
    .get<T>(url, parameters)
    .then((response: AxiosResponse<T>) => {
      return response.data;
    })
    .catch(() => {
        console.log('error');
    })
}

const App: FunctionComponent = () => {
    const { user } = useUserContext()
    const { isLoggedIn, isAdmin } = user

    /*if (!isLoggedIn) {
        return (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        )
    }*/
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={
                    <ApplicationProvider>
                        <CharacterFilterProvider>
                            <h1>Random Hanzi</h1>                
                            <RandomHanzi />
                        </CharacterFilterProvider>
                    </ApplicationProvider>
                } />
                {!isLoggedIn && <>
                    <Route path="/login" element={<Login />} />
                </>}
                {isLoggedIn && <>
                    <Route path="/info" element={<Info />} />
                    <Route path="/characters" element={<CharactersList />} />
                </>}
                {isLoggedIn && isAdmin && <>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/characters" element={<CharactersList />} />
                    <Route path="/admin/characters/:id" element={<CharacterDetail />} />
                    <Route path="/admin/characters/import" element={<CharactersImport />} />
                </>}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
}

export default App;
