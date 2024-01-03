import React from 'react'
import useUserContext from '../hooks/useUserContext'

const Logout = () => {
    const { logoutUser } = useUserContext()

    const handleLogout = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if (response.ok) {
            logoutUser()
        }
    }

    return (
        <button type="submit" onClick={handleLogout}>
            esci
        </button>
    )
}

export default Logout
