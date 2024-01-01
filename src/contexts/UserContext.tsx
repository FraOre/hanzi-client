
import { FunctionComponent, ReactNode, createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { UserContextInterface } from '../types';
import { UserInterface } from '../types/user';

const UserContext = createContext<UserContextInterface | null>(null);

const UserProvider: FunctionComponent<{
    children: ReactNode;
}> = ({ children }) => {
    const [user, setUser] = useLocalStorage<UserInterface>('user', {
        id: null,
        email: null,
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