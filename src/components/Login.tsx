import { FunctionComponent } from 'react'
import useUserContext from '../hooks/useUserContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { LoginResponseInterface } from '../types/auth'
import { useNavigate } from 'react-router-dom'

interface LoginFormInterface {
    email: string
    password: string
}

const Login: FunctionComponent = () => {
    const navigate = useNavigate();
    const { updateAccessToken, updateUser } = useUserContext()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInterface>()
    const handleLogin: SubmitHandler<LoginFormInterface> = async data => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        
        if (response.ok) {
            const loginResponse: LoginResponseInterface = await response.json()
            updateAccessToken(loginResponse.accessToken)
            updateUser(loginResponse.loginUser)
            navigate('/')
        }
    }

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(handleLogin)}>
                <div>
                    <label>Email</label>
                    <input type='text' {...register('email', { required: true })} />
                    {errors.email?.type === 'required' && <small>Email is required</small>}
                </div>
                <div>
                    <label>Password</label>
                    <input type='password' {...register('password', { required: true })} />
                    {errors.password?.type === 'required' && <small>Password is required</small>}
                </div>
                <div>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </>
    )
}

export default Login
