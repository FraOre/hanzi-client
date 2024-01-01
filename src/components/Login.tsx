import { FunctionComponent } from 'react';
import useUserContext from '../hooks/useUserContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UserResponseInterface } from '../types/user';

interface LoginFormInterface {
    email: string;
    password: string;
}

const Login: FunctionComponent = () => {
    const { updateToken, updateUser } = useUserContext();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInterface>();

    const handleLogin: SubmitHandler<LoginFormInterface> = async data => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const userResponse: UserResponseInterface = await response.json();

            updateUser({
                id: userResponse.user.id,
                email: userResponse.user.email,
                isAdmin: userResponse.user.isAdmin,
                isLoggedIn: true
            });

            updateToken(userResponse.token);
        }
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(handleLogin)}>
                <div>
                    <label>Email</label>
                    <input type="text" {...register('email', { required: true })} />
                    {errors.email?.type === 'required' && <small>Email is required</small>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" {...register('password', { required: true })} />
                    {errors.password?.type === 'required' && <small>Password is required</small>}
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </>
    );
};

export default Login;