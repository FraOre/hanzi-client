import { ChangeEvent, FunctionComponent, FormEvent, useState } from 'react';
import useUserContext from '../hooks/useUserContext';
import { HANZI_SERVER } from '../settings';
import { FormDataInterface, UserResponseInterface } from '../types';

const Login: FunctionComponent = () => {
    const { updateToken, user, updateUser } = useUserContext();
    const { isLoggedIn } = user;

    const [formData, setFormData] = useState<FormDataInterface>({
        email: '',
        password: ''
    });

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch(HANZI_SERVER.URL + '/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const userResponse: UserResponseInterface = await response.json();

            updateUser({
                id: userResponse.user.id,
                email: userResponse.user.email,
                username: userResponse.user.username,
                isAdmin: userResponse.user.isAdmin,
                isLoggedIn: true
            });

            updateToken(userResponse.token);
        }
    };

    if (isLoggedIn) {
        return (
            <div>
                LOGGATO! BOH!
            </div>
        );
    }

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input type="text" value={formData.email} name="email" onChange={handleFormChange} autoComplete="on" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={formData.password} name="password" onChange={handleFormChange} autoComplete="off" />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </>
    );
};

export default Login;