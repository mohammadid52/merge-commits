import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { IconContext } from "react-icons";
import { FaKey } from 'react-icons/fa'; 
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { 
    useHistory,
    Link, NavLink
} from 'react-router-dom';
// import { Auth } from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import Forgot from './Forgot';

const Login = () => {
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
    const [passToggle, setPassToggle] = useState(false);

    async function SignIn() {
        let username = input.email;
        let password = input.password;

        try {
            const user = await Auth.signIn(username, password);
            dispatch({type: "LOG_IN", payload: { email: username, authId: user.username }})
            setCookie('auth', { email: username, authId: user.username }, { secure: false })
            history.push('/dashboard')
        } catch (error) {
            console.error('error signing in', error);
            if ( error.code === "UserNotConfirmedException" ) {
                return history.push('/confirm')
            }
            
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
                } if (!password) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Please enter your password',
                    }
                }
                switch (error.code) {
                    case "UserNotFoundException":
                        return {
                                    show: true,
                                    type: 'error',
                                    message: 'The email you entered was not found',
                                }
                    case "NotAuthorizedException":
                            return {
                                        show: true,
                                        type: 'error',
                                        message: 'The email or password you entered was not correct',
                                    }
                    // case "UserNotConfirmedException":
                    //         return history.push('/confirm')
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

    const handleChange = (e: { target: { id: any; value: any } }) => {
      const { id, value } = e.target;
      setInput((input) => {
        if (id === 'email') {
          return {
            ...input,
            [id]: value.toLowerCase(),
          };
        } else {
          return {
            ...input,
            [id]: value,
          };
        }
      });
    };

    const handleEnter = (e: any) => {
        if (e.key === 'Enter') {
            SignIn()
        }
    }

    const handleSubmit = () => {
        SignIn()
    }

    return (
        
        <div className="w-full h-screen flex items-center justify-center">
             
            <div className="test login w-140 h-7/10 bg-gray-200 shadow-elem-light border border-gray-300 rounded-lg pt-0">
                <div className="h-.7/10 bg-dark w-full rounded-t-lg"></div>
                <div className="relative h-9.3/10 flex flex-col items-center p-8">
                    <div className="absolute text-center text-xs mb-3" style={{bottom: '0'}}> 
                        <p>© Copyright 2020</p>
                        <p><NavLink className="underline text-sm hover:text-blue-500" to="/privacy-policy">Privacy Policy</NavLink></p>
                    </div>
                    <div className="h-2/10">
                        <img className="" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                    </div>
                   
            
                    <div className="h-4.5/10 flex-grow flex flex-col justify-center">
                        <div className="w-full h-1/10 flex justify-center items-center">
                            {
                                message.show ? (
                                    <p className={`text-sm text-center ${ message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null}`}>
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
                            <input className="w-full px-2 py-1 ml-2 bg-off-white" placeholder="Email" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
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
                            <IconContext.Provider value={{ size: '1.2rem'}}>
                                <FaKey />
                            </IconContext.Provider>
                            </div>

                            <label className="hidden" htmlFor="password">Password</label>
                            <input className="w-full px-2 py-1 ml-2 bg-off-white" placeholder="Password" type={passToggle ? 'text' : 'password'} id="password" name="password" value={input.password} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
                    </div>
                    
                   
                    {/* <Link to="/register">Register</Link> */} 
                    <div className="h-4.5/10 flex flex-col justify-center items-center">
                        <button className="bg-dark-red text-gray-200 rounded-lg mb-4 shadow-elem-light" onKeyPress={handleEnter} onClick={handleSubmit}>Login</button>
                        <NavLink to="/forgot-password">
                            <div className="text-center hover:text-blue-500">forgot password?</div>
                        </NavLink>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Login;