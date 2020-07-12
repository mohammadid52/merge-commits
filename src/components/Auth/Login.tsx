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
    const [ message, setMessage ] = useState<{show: boolean, type: string, message: string,}>({
        show: false,
        type: '',
        message: '',
    })
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
            console.error('error signing in', error);
            if ( error.code === "UserNotConfirmedException" ) {
                return history.push('/confirm')
            }
            setMessage(() => {
                return {
                    show: true,
                    type: 'error',
                    message: error.message,
                }
            })
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

    const handleEnter = (e: any) => {
        if (e.key === 'Enter') {
            SignIn()
        }
    }

    const handleSubmit = () => {
        SignIn()
    }

    return (
        <div className="w-full h-200 flex flex-col items-center justify-center">
            <div className="w-140 h-140 bg-gray-200 p-8 flex flex-col items-center shadow-elem-light border border-gray-300 rounded">
                <h1 className="text-3xl font-open font-bold">Login</h1>
                <div className="w-full h-12 flex justify-center items-center">
                    {
                        message.show ? (
                            <p className={`text-sm ${ message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null}`}>
                                { message.message }
                            </p>
                        ) : null
                    }
                </div>
                <div className="w-5/10 flex-grow flex flex-col items-center py-4">
                    <label htmlFor="email">Email</label>
                    <input className="w-full px-2 py-1 mb-4 " type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                    <label htmlFor="password">Password</label>
                    <input className="w-full px-2 py-1 mb-4" type="password" id="password" name="password" value={input.password} onChange={handleChange} onKeyDown={handleEnter}/>
                </div>
                {/* <Link to="/register">Register</Link> */} 
                <button className="w-20 h-12 bg-dark-red text-gray-200 rounded shadow-elem-light mb-4" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Login;