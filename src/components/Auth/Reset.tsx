import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { IconContext } from "react-icons";
import { FaKey } from 'react-icons/fa';
import { FaUnlockAlt } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { 
    useHistory,
    Link, NavLink
} from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Reset = () => {
    const [ cookies, setCookie ] = useCookies(['auth']);
    const history = useHistory();
    const { theme, state, dispatch } = useContext(GlobalContext);
    const [ message, setMessage ] = useState<{show: boolean, type: string, message: string,}>({
        show: false,
        type: '',
        message: '',
    })
    const [ input, setInput ] = useState({
        email: '',
        code: '',
        password: '',
        match: ''
    })
    const [passToggle, setPassToggle] = useState(false);
    const [newPassToggle, setNewPassToggle] = useState(false);

    async function reset() {
        // if ( input.password !== input.match ) {
        //     return setMessage(() => {
        //         return {
        //             show: true,
        //             type: 'error',
        //             message: 'Passwords do not match',
        //         }
        //     })
        // }

        let username = input.email;
        let password = input.password;
        let match = input.match
        let code = input.code;

        try {
            const forgot = await Auth.forgotPasswordSubmit(username, code, password);
            // .then(data => console.log(data))
            // .catch(err => console.log(err));
            history.push('/login');
            
        } catch (error) {
            console.error('error signing in', error);
            setMessage (() => {
                switch (error.code) {
                    case "InvalidPasswordException":
                        return {
                                    show: true,
                                    type: 'error',
                                    message: 'Password must be at least 8 characters, include uppercase, lowercase and numbers',
                                }
                    case "InvalidParameterException":
                            return {
                                        show: true,
                                        type: 'error',
                                        message: 'Password must be at least 8 characters, include uppercase, lowercase and numbers',
                                    }
                    case "UserNotFoundException":
                        return {
                                    show: true,
                                    type: 'error',
                                    message: 'The email you entered was not found',
                                }
                    case "CodeMismatchException":
                        return {
                                    show: true,
                                    type: 'error',
                                    message: 'The confirmation code you provided is not correct',
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

    const validation = () => {
        let validated = false;
        
        setMessage (() => {
        let username = input.email;
        let password = input.password;
        let match = input.match
        let code = input.code;
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
        } if (!password) {
            return {
                show: true,
                type: 'error',
                message: 'Please enter your new password',
            }
        } if (!match) {
            return {
                show: true,
                type: 'error',
                message: 'Please enter your confirmation password',
            }
        } if ( password !== match ) {
            return {
                show: true,
                type: 'error',
                message: 'Your new password and confirmation password do not match',
            }
        }  
        validated = true;
        if (validated) {
            reset();
        }
        return {
            show: false,
            type: 'success',
            message: 'success',
        }    
        })

        
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
            validation();
        }
    }

    const handleSubmit = () => {
        validation();
        
    }

    return (
        
        <div className="w-full h-screen flex flex-col items-center justify-center">
             
            <div className="test login w-140 h-7/10 bg-gray-200 shadow-elem-light border border-gray-300 rounded pt-0">
                <div className="h-.7/10 bg-dark w-full rounded-t-lg"></div>
                <div className="h-9.3/10 flex flex-col items-center justify-center px-8 pt-4 pb-8">
                    <div className="2/10">
                        <img src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                    </div>

                    <div className="w-full h-2.2/10 flex flex-col justify-around items-center">
                        <div className="text-center text-sm">Check your email for your confirmation code</div>
                        <div className="text-center text-xs">*password must be at least 8 characters and include uppercase and lowercase</div>
                            {
                                message.show ? (
                                    <p className={`text-xs text-center ${ message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null}`}>
                                        { message.message }
                                    </p>
                                ) : null
                            }
                        </div>
            
                    <div className="h-3.8/10 flex-grow flex flex-col">
                    

                        <div className="input">
                                <div className="icon">
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <MdEmail />
                                </IconContext.Provider>
                                </div>
                            <label className="hidden" htmlFor="email">Email</label>
                            <input className="w-full px-2 py-1 ml-2" placeholder="Email" type="text" id="email" name="email" value={input.email} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>

                        <div className="input">
                                <div className="icon">
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <FaUnlockAlt />
                                </IconContext.Provider>
                                </div>
                            <label className="hidden" htmlFor="code">Confirmation Code</label>
                            <input className="w-full px-2 py-1 ml-2" placeholder="Confirmation Code" type="text" id="code" name="code" value={input.code} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
        
                        <div className="input relative w-full">
                            <div style={{right: 0}} className="absolute w-6">
                                <div onClick={() => setNewPassToggle(!newPassToggle)} className="text-gray-500 cursor-pointer hover:text-grayscale">
                                { newPassToggle ?
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEye />
                                </IconContext.Provider> :
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEyeInvisible />
                                </IconContext.Provider>
                                }
                                </div>
                            </div>

                            <div className="icon">
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <FaKey />
                                </IconContext.Provider> 
                            </div>
                            <label className="hidden" htmlFor="password">New Password</label>
                            <input className="w-full px-2 py-1 ml-2" placeholder="New Password" type={ newPassToggle ? 'text' : 'password'} id="password" name="password" value={input.password} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>

                        <div className="input relative w-full">
                            <div style={{right: 0}} className="absolute w-6">
                                <div onClick={() => setPassToggle(!passToggle)} className="text-gray-500 cursor-pointer hover:text-grayscale">
                                { passToggle ?
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEye />
                                </IconContext.Provider> :
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEyeInvisible />
                                </IconContext.Provider>
                                }
                                </div>
                            </div>

                            <div className="icon">
                            <IconContext.Provider value={{ size: '1.5rem'}}>
                                <FaKey />
                            </IconContext.Provider>
                            </div>
                            <label className="hidden" htmlFor="match">Confirm Password</label>
                            <input className="w-full px-2 py-1 ml-2" placeholder="Confirm Password" type={passToggle ? 'text' : 'password'} id="match" name="match" value={input.match} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
                    
                    </div>
                    
                
                    <div className="h-2/10 flex flex-col justify-center items-center">
                        <div className="cursor-pointer shadow-elem-light text-center rounded-lg bg-dark-red text-gray-200 my-4" style={{borderRadius: '2rem', padding: '.75rem'}} onKeyPress={handleEnter} onClick={handleSubmit}>
                            Reset Password
                        </div>
                        <NavLink to="/forgot-password">
                        <div className="text-center text-sm hover:text-blue-500">request another confirmation code</div>
                        </NavLink>
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Reset;