import React, { useState } from 'react';
import { Auth } from 'aws-amplify'; 
import { IconContext } from "react-icons";
import { FaUnlockAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import {
    useHistory
} from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Registration = () => {
    const history = useHistory();
    const [ cookies, setCookie ] = useCookies(['confirm_user'])
    const [ message, setMessage ] = useState<{show: boolean, type: string, message: string,}>({
        show: false,
        type: '',
        message: '',
    })
    const [ input, setInput ] = useState({
        email: '',
        code: '',
    })

    async function confirmSignUp() {
        let username = input.email
        let code = input.code
        try {
            setCookie('confirm_user', input.email);
            let res = await Auth.confirmSignUp(username, code);
            console.log(res)
            history.push('/new-password');
        } catch (error) {
            console.log('error confirming sign up', error);
            /////change the error code
            setMessage(() => { 
                if (!username) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Please enter your email',
                    }
                } if (!username.includes("@")) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Your email is not in the expected email address format',
                    }
                } if (!code) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Please enter your confirmation code',
                    }
                } 
                switch (error.code) {
                    case "UserNotFoundException":
                        return {
                                    show: true,
                                    type: 'error',
                                    message: 'The email you entered was not found',
                                }
                    default: 
                    return {
                            show: true,
                            type: 'error',
                            message: error.message,
                        };  
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
            confirmSignUp()
        }
    }

    const handleSubmit = (e: any) => {
        console.log(input);
        confirmSignUp()
        console.log('attempt')
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="test login w-140 h-7/10 bg-gray-200 shadow-elem-light border border-gray-300 rounded pt-0">
            <div className="h-.7/10 bg-dark w-full rounded-t-lg"></div>
            <div className="relative h-9.3/10 flex flex-col items-center p-8">
                <div className="absolute text-center text-xs mb-4" style={{bottom: '0'}}> © Copyright 2020 </div>
                <div className="h-2/10">
                    <img src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                </div>
                <div className="w-full h-1/10 flex justify-center items-center">
                        {
                            message.show ? (
                                <p className={`text-sm text-center ${ message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null}`}>
                                    { message.message }
                                </p>
                            ) : null
                        }
                </div>

                <div className="h-5/10 flex-grow flex flex-col justify-center">
                    <div className="input">
                            <div className="icon">
                            <IconContext.Provider value={{ size: '1.5rem'}}>
                                <MdEmail />
                            </IconContext.Provider>
                            </div>
                        <label className="hidden" htmlFor="email">Email</label>
                        <input className="w-full px-2 py-1 ml-2" placeholder="Email" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                    </div>

                    <div className="input">
                            <div className="icon">
                            <IconContext.Provider value={{ size: '1.5rem'}}>
                                <FaUnlockAlt />
                            </IconContext.Provider>
                            </div>
                        <label className="hidden" htmlFor="code">Confirmation Code</label>
                        <input className="w-full px-2 py-1 ml-2" placeholder="Confirmation Code" type="text" id="code" name="code" value={input.code} onChange={handleChange}/>
                    </div>
                </div>
             
                <div className="h-3/10 flex flex-col justify-center items-center">
                    <button className="bg-dark-red text-gray-200 rounded shadow-elem-light mb-4" onKeyPress={handleEnter} onClick={handleSubmit}>Confirm Password</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Registration;