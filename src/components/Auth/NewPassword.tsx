import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useCookies } from 'react-cookie';
import { IconContext } from "react-icons";
import { FaKey } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

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
                    if (!input.password) { 
                        return {
                            show: true,
                            type: 'error',
                            message: 'New password cannot be blank',
                        }
                    }
                    if (!input.match) {
                        return {
                            show: true,
                            type: 'error',
                            message: 'Confirm password cannot be blank',
                        }
                    }
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
        <div className="w-full h-screen flex items-center justify-center">
            <div className="test login w-140 h-7/10 bg-gray-200 shadow-elem-light border border-gray-300 rounded pt-0">
            <div className="h-.7/10 bg-dark w-full rounded-t-lg"></div>
            <div className="h-9.3/10 flex flex-col items-center p-8">
                <div className="h-2/10">
                    <img src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                </div>

                <div className="w-full h-1/10 flex justify-center items-center">
                    {
                        message.show ? (
                            <p className={`text-sm ${ message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null}`}>
                                { message.message }
                            </p>
                        ) : null
                    }
                </div>

            
                <div className="h-5/10 flex-grow flex flex-col justify-center">
                    
                        
                        <div className="input">
                            <div className="icon">
                                <IconContext.Provider value={{ size: '1.2rem'}}>
                                    <FaKey />
                                </IconContext.Provider>
                            </div>
                            <label className="hidden" htmlFor="password">New Password</label>
                            <input className="w-full px-2 py-1 ml-2" placeholder="New Password" type="password" id="password" name="password" value={input.password} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
                        <div className="input">
                            <div className="icon">
                                <IconContext.Provider value={{ size: '1.2rem'}}>
                                    <FaKey />
                                </IconContext.Provider>
                            </div>
                            <label className="hidden" htmlFor="match">Confirm Password</label>
                            <input className="w-full px-2 py-1 ml-2" placeholder="Confirm Password" type="password" id="match" name="match" value={input.match} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
                    
                </div>
                

                <div className="h-3/10 flex flex-col justify-center items-center">
                    <button className="bg-dark-red text-gray-200 shadow-elem-light rounded-lg mb-4" onKeyPress={handleEnter} onClick={handleSubmit}>Set New Password</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default NewPassword;