import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { 
    useHistory,
    Link
} from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Login = () => {
    const [ cookies, setCookie ] = useCookies(['auth']);
    const history = useHistory();
    const { state, dispatch } = useContext(GlobalContext);
    const [ input, setInput ] = useState({
        email: '',
        password: '',
    })

    async function SignIn() {
        let username = input.email;
        let password = input.password;

        try {
            const user = await Auth.signIn(username, password);
            console.log({ user })
            dispatch({type: "LOG_IN", payload: { email: username, authId: user.username }})
            setCookie('auth', { email: username, authId: user.username }, { secure: false })
            history.push('/dashboard')
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    const handleChange = (e: { target: { id: any; value: any; }; }) => {
        const { id, value } = e.target;
        setInput(input => {
            return {
                ...input,
                [id]: value,
            }
        })
    }

    const handleSubmit = (e: any) => {
        console.log('log-in attempt')
        SignIn()
    }

    return (
        <div className="w-full h-200 flex flex-col items-center justify-center">
            <div className="w-120 h-120 bg-gray-300 p-8 flex flex-col items-center justify-around shadow-elem-dark rounded">
                <h1 className="text-3xl font-open font-bold">Login</h1>
                <div className="flex flex-col justify-around items-center">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={input.password} onChange={handleChange}/>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p>New to Iconoclast Artists?</p>
                    <Link to="/register">Click here!</Link>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Login;