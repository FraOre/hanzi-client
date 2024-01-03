import { FunctionComponent, ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import { UserContextInterface } from '../types'
import { LoginUserInterface, RefreshResponseInterface } from '../types/auth'
import { UserInterface } from '../types/user'
import { set } from 'react-hook-form'

const UserContext = createContext<UserContextInterface | null>(null)

const UserProvider: FunctionComponent<{
    children: ReactNode
}> = ({ children }) => {
    const anonymousUser: UserInterface = {
        id: null,
        email: null,
        isAdmin: false,
        isLoggedIn: false
    }

    const [user, setUser] = useState<UserInterface>(anonymousUser)

    const updateUser = (loginUser: LoginUserInterface) => {
        setUser({
            ...loginUser,
            isLoggedIn: true
        })
    }

    const logoutUser = () => {
        setUser(anonymousUser)
        setAccessToken('')
    }

    const [accessToken, setAccessToken] = useState<string>('')

    const updateAccessToken = (accessToken: string) => {
        setAccessToken(accessToken)
    }

    const refreshAccessToken = useCallback(async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        })

        if (response.ok) {
            const refreshResponse: RefreshResponseInterface = await response.json()
            updateAccessToken(refreshResponse.accessToken)
            updateUser(refreshResponse.loginUser)
        }
    }, [])

    useEffect(() => {
        if (!accessToken) {
            refreshAccessToken()
        }
    }, [accessToken, refreshAccessToken])

    return (
        <UserContext.Provider value={{ accessToken, updateAccessToken, user, updateUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
