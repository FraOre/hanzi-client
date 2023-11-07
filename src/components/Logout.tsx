import React from 'react';
import useUserContext from '../hooks/useUserContext';
import { logout } from '../api';

const Logout = () => {
    const { updateUser, updateToken } = useUserContext();

    const handleLogout = async () => {
        logout()
            .then(() => {
                updateUser({
                    id: null,
                    email: null,
                    username: null,
                    isAdmin: false,
                    isLoggedIn: false
                });
                updateToken('');
            });
    };

    return (
        <button type="submit" onClick={handleLogout}>
            esci
        </button>
    );
};

export default Logout;