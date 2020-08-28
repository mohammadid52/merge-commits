import React, { useContext, useState } from 'react';
// import { GlobalContext } from '../../contexts/GlobalContext';
// import { useCookies } from 'react-cookie';
import ErrorNote from '../Admin/UserManagement/ErrorNote';
import { IconContext } from "react-icons";
import { FaKey } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useHistory, NavLink } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const ChangePassword = () => {
    const [oldPassToggle, setOldPassToggle] = useState(false);
    const [passToggle, setPassToggle] = useState(false);
    const [passMatchToggle, setPassMatchToggle] = useState(false);
    // const [ cookies, setCookie ] = useCookies(['auth']);
    const history = useHistory();
    // const { theme, state, dispatch } = useContext(GlobalContext);
    const [ message, setMessage ] = useState<{show: boolean, type: string, message: string,}>({
        show: false,
        type: '',
        message: '',
    })
    const [ input, setInput ] = useState({
        oldPassword: '',
        newPassword: '',
        match: ''
    })


    async function change() {
        let oldPassword = input.oldPassword;
        let newPassword = input.newPassword;
        // let match = input.match;

        // Auth.currentAuthenticatedUser()
        // .then(data => console.log(data, 'data'))
        // .then(user => {
        //     return Auth.changePassword(user, oldPassword, newPassword);
        // })
        // .then(data => console.log(data, 'change password'))
        // .catch((err: any) => 
        // console.log(err, 'err'))

        // const user = Auth.currentAuthenticatedUser()
        
        try {
            const user = await Auth.currentAuthenticatedUser();
            console.log(user);
            const passwordChange = await Auth.changePassword(user, oldPassword, newPassword);
            console.log(passwordChange)
            history.push('/dashboard/profile');
            
        } catch (error) {
            console.error('error signing in', error);
            setMessage (() => {
                if (!oldPassword) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Old password cannot be blank',
                    }
                } if (!newPassword) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'New password cannot be blank',
                    }
                } if (!input.match) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Confirm password cannot be blank',
                    }
                } if ( input.newPassword !== input.match ) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'Passwords do not match',
                    }
                }
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
            change()
        }
    }

    const handleSubmit = () => {
        console.log('change')
        change();
    }

    return (

    <div className="h-full w-full md:px-4 pt-4">
            {/* <form> */}

            <div className="h-auto bg-white shadow-5 sm:rounded-lg mb-4">
            
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Change your Password
                    </h3>
                </div>

                <div className="h-full px-4 py-5 sm:px-6">
                    <div className="text-center text-sm">* password must be at least 8 characters and include uppercase and lowercase</div>
                    <div className="w-full h-auto flex flex-col justify-between items-center my-4">

                        <div className="w-3.27/10 m-1 relative">
                        <div className="border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm flex justify-between items-center">
                            <div style={{right: 0}} className="absolute right-0 w-auto mr-2">
                                <div onClick={() => setOldPassToggle(!oldPassToggle)} className="text-gray-500 cursor-pointer hover:text-grayscale">
                                { oldPassToggle ?
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEye />
                                </IconContext.Provider> :
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEyeInvisible />
                                </IconContext.Provider>
                                }
                                </div>
                            </div>
                            <div className="w-auto flex justify-center items-center mr-2">
                                <IconContext.Provider value={{ size: '1.2rem'}}>
                                    <FaKey />
                                </IconContext.Provider>
                            </div>
                            <label className="hidden" htmlFor="oldPassword">Old Password</label>
                            <input className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Old Password" type={oldPassToggle ? 'text' : 'password'} id="oldPassword" name="password" defaultValue={input.oldPassword} onChange={handleChange} onKeyDown={handleEnter}/>
                        </div>
                        </div>

                        <div className="w-3.27/10 m-1 relative">
                        <div className="border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm flex justify-between items-center">
                            <div style={{right: 0}} className="absolute right-0 w-auto mr-2">
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
                            <div className="w-auto flex justify-center items-center mr-2">
                                <IconContext.Provider value={{ size: '1.2rem'}}>
                                    <FaKey />
                                </IconContext.Provider>
                            </div>
                            <label className="hidden" htmlFor="password">New Password</label>
                            <input className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="New Password" type={passToggle ? 'text' : 'password'}  id="newPassword" name="password" defaultValue={input.newPassword} onChange={handleChange}/>
                        </div>
                        </div>

                        <div className="w-3.27/10 m-1 relative">
                            <div className="border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm flex justify-between items-center">
                            <div style={{right: 0}} className="absolute right-0 w-auto mr-2">
                                <div onClick={() => setPassMatchToggle(!passMatchToggle)} className="text-gray-500 cursor-pointer hover:text-grayscale">
                                { passMatchToggle ?
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEye />
                                </IconContext.Provider> :
                                <IconContext.Provider value={{ size: '1.5rem'}}>
                                    <AiOutlineEyeInvisible />
                                </IconContext.Provider>
                                }
                                </div>
                            </div>
                                <div className="w-auto flex justify-center items-center mr-2">
                                    <IconContext.Provider value={{ size: '1.2rem'}}>
                                        <FaKey />
                                    </IconContext.Provider>
                                </div>
                                <label className="hidden" htmlFor="match">Confirm Password</label>
                                <input className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Confirm Password" type={passMatchToggle ? 'text' : 'password'}  id="match" name="match" defaultValue={input.match} onChange={handleChange}/>
                            </div>
                        </div>

                    </div>
                    <NavLink to="/forgot-password">
                        <div className="text-sm text-center hover:text-blue-500">can't remember your old password?</div>
                    </NavLink>
                </div>  


            </div>
                <div className="w-full flex justify-center items-center">
                    {
                        message.show ? (
                            <div>
                                <ErrorNote 
                                    note={message.message}
                                />
                            </div>
                        ) : null
                    }
                </div>


            <div className="px-4 pt-4 w-full flex justify-end">
                <div className="flex w-5.8/10">
                <span className="inline-flex rounded-md shadow-sm">
                    <NavLink to={`/dashboard/profile`}>
                    <button type="button" className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                    Cancel
                    </button>
                    </NavLink>
                </span>
                <div className="ml-3 inline-flex rounded-md shadow-5">
                    <button onClick={handleSubmit} className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700">
                    Save New Password
                    </button>
                </div>
                </div>
            </div>

            {/* </form> */}
        </div>
    )
}

export default ChangePassword;