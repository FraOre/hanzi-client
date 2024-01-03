import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'
import useUserContext from '../hooks/useUserContext'

const Header: FunctionComponent = () => {
    const { user } = useUserContext()
    const { isLoggedIn, email } = user

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Hanzi App</div>

            <div>
                {isLoggedIn ? (
                    <>
                        <span>Benvenuto, {email}</span>
                        <Logout />
                    </>
                ) : (
                    <Link to='/login'>Accedi</Link>
                )}
            </div>
        </header>
    )
}

export default Header
