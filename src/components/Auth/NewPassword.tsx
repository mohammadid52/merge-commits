import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useCookies } from 'react-cookie';

const NewPassword = () => {
    const { state, dispatch  } = useContext(GlobalContext)
    const history = useHistory();
    const [ input, setInput ] = useState({
        password: '',
        match: '',
    })
    const [ message, setMessage ] = useState<{show: boolean, type: string, message: string,}>({
        show: false,
        type: '',
        message: '',
    })
    const [ cookies, setCookie ] = useCookies(['confirm_user'])

    async function changePassword() {
        if ( input.password !== input.match ) {
            return setMessage(() => {
                return {
                    show: true,
                    type: 'error',
                    message: 'Passwords do not match',
                }
            })
        }

        if ( cookies.confirm_user ) {

            let username = cookies.confirm_user
            let password = 'xIconoclast.5x'

            try {
                const user = await Auth.signIn(username, password);
                const res = await Auth.changePassword(user, password, input.password)
                console.log(res);
                dispatch({type: "LOG_IN", payload: { email: username, authId: user.username }})
                setCookie('auth', { email: username, authId: user.username }, { secure: false })
                history.push('/dashboard')
            } catch (error) {
                console.error('error signing in', error);
                setMessage(() => {
                    return {
                        show: true,
                        type: 'error',
                        message: error.message,
                    }
                })
            }
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
            changePassword()
        }
    }

    const handleSubmit = () => {
        changePassword()
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="test login w-140 h-140 bg-gray-200 px-8 py-12 flex flex-col items-center justify-around shadow-elem-dark rounded">
                <h1 className="text-4xl font-open font-bold">Enter your new password</h1>
            
                <div className="flex-grow flex flex-col py-4">
                    <div>
                        <div className="input">
                            <label className="hidden" htmlFor="password">New Password</label>
                            <input className="w-full px-2 py-1 mb-4" placeholder="New Password" type="password" id="password" name="password" value={input.password} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
                        <div className="input">
                            <label className="hidden" htmlFor="match">Confirm Password</label>
                            <input className="w-full px-2 py-1 mb-4" placeholder="Confirm Password" type="password" id="match" name="match" value={input.match} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
                    </div>
                </div>
                <div className="w-full h-12 flex justify-center items-center">
                    {
                        message.show ? (
                            <p className={`text-sm ${ message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null}`}>
                                { message.message }
                            </p>
                        ) : null
                    }
                </div>
                <button className="w-20 h-12 bg-dark-red text-gray-200 rounded shadow-elem-light mb-4" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default NewPassword;