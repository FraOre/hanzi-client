
import { FunctionComponent, createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { UserContextInterface, UserInterface, UserProviderInterface } from '../types';

const UserContext = createContext<UserContextInterface | null>(null);

const UserProvider: FunctionComponent<UserProviderInterface> = ({ children }) => {
    const [user, setUser] = useLocalStorage<UserInterface>('user', {
        id: null,
        email: null,
        username: null,
        isAdmin: false,
        isLoggedIn: false
    });

    const updateUser = (data: UserInterface) => {
        setUser({
            ...user,
            ...data
        });
    };

    // Crea token con useLocalStorage
    const [token, setToken] = useLocalStorage<string>('token', '');

    const updateToken = (data: string) => {
        setToken(data);
    };

    return (
        <UserContext.Provider value={{ token, updateToken, user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };