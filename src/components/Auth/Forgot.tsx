import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { IconContext } from "react-icons";
import { MdEmail } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Forgot = () => {
    const [ cookies, setCookie ] = useCookies(['auth']);
    const history = useHistory();
    const { theme, state, dispatch } = useContext(GlobalContext);
    let [ message, setMessage ] = useState<{show: boolean, type: string, message: string,}>({
        show: false,
        type: '',
        message: '',
    })
    const [ input, setInput ] = useState({
        email: '',
        password: '',
    })

    async function forgotPassword() {
        let username = input.email;

        try {
            const user = await Auth.forgotPassword(username);
            console.log({ user })
            history.push('/reset-password')
        } catch (error) {
            console.error('error signing in', error);
            setMessage(() => { 
                if (!username) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Email cannot be blank',
                    }
                } if (!username.includes("@")) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Email is not in the expected email address format',
                    }
                } 
                switch (error.code) {
                    case "UserNotFoundException":
                        return {
                                    show: true,
                                    type: 'error',
                                    message: 'Email was not found',
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
            forgotPassword()
        }
    }

    const handleSubmit = () => {
        forgotPassword()
    }

    return (
        
        <div className="w-full h-screen flex flex-col items-center justify-center">
             
            <div className="test login w-140 h-7/10 bg-gray-200 shadow-elem-light border border-gray-300 rounded pt-0">
                <div className="h-.7/10 bg-dark w-full rounded-t-lg"></div>
                <div className="h-9.3/10 flex flex-col items-center justify-center p-8">
                    <div className="h-2/10">
                        <img src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                    </div>

                    <div className="h-1/10 text-center text-xl">Input your email to reset your password</div>

                    
            
                    <div className="h-4/10 flex-grow flex flex-col justify-around">

                        <div className="w-full flex justify-center items-center">
                            {
                                message.show ? (
                                    <p className={`text-sm ${ message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null}`}>
                                        { message.message }
                                    </p>
                                ) : null
                            }
                        </div>
                        
                        
                        <div className="input">
                                <div className="icon">
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <MdEmail />
                                </IconContext.Provider>
                                </div>
                            <label className="hidden" htmlFor="email">Email</label>
                            <input className="w-full px-2 py-1 ml-2" placeholder="Email" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                        </div>
                    
                    </div>
                    
                    

                    <div className="h-3/10 flex flex-col justify-center items-center">
                        
                            <button className="bg-dark-red shadow-elem-light text-gray-200 rounded-lg mb-4" onKeyPress={handleEnter} onClick={handleSubmit}>
                                Submit
                            </button>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Forgot;