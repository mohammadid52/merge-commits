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
    Link
} from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Login = () => {
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
        password: '',
    })
    const [passToggle, setPassToggle] = useState(false);

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
        
        <div className="w-full h-screen flex flex-col items-center justify-center">
             
            <div className="test login w-140 h-7/10 bg-gray-200 shadow-elem-light border border-gray-300 rounded pt-0">
                <div className="h-.7/10 bg-dark w-full rounded-t-lg"></div>
                <div className="h-9.3/10 flex flex-col items-center p-8">
                    <div>
                        <img className="mb-8" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                    </div>
            
                    <div className="flex-grow flex flex-col justify-center py-4 pt-12">
                        
                        <div className="input">
                                <div className="icon">
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <MdEmail />
                                </IconContext.Provider>
                                </div>
                            <label className="hidden" htmlFor="email">Email</label>
                            <input className="w-full px-2 py-1 mb-2" placeholder="Email" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                        </div>
                    
                        <div className="input relative">
                            <div style={{right: 0}} className="absolute right-0 w-auto">
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
                            <input className="w-full px-2 py-1 mb-2" placeholder="Password" type={passToggle ? 'text' : 'password'} id="password" name="password" value={input.password} onChange={handleChange} onKeyDown={handleEnter}/>
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
                    {/* <Link to="/register">Register</Link> */} 
                    <button className="bg-dark-red text-gray-200 rounded-lg mb-4" onClick={handleSubmit}>Login</button>
                    <div className="text-center">forgot password?</div>
                    <div className="text-center">reset password?</div>
                </div>
            </div>
            
        </div>
    )
}

export default Login;