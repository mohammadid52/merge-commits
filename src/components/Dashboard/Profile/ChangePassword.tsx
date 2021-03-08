import React, { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Auth } from '@aws-amplify/auth';
import { validate } from 'json-schema';
import { FaKey } from 'react-icons/fa';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useHistory, NavLink } from 'react-router-dom';

import ErrorNote from '../Admin/UserManagement/ErrorNote';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import Buttons from '../../Atoms/Buttons';
import ModalPopUp from '../../Molecules/ModalPopUp';

import * as customMutations from '../../../customGraphql/customMutations';

interface ChangePasswordProps {
    updateAuthState: Function
}

const ChangePassword = (props: ChangePasswordProps) => {
    const { updateAuthState } = props
    const [oldPassToggle, setOldPassToggle] = useState(false);
    const [passToggle, setPassToggle] = useState(false);
    const [passMatchToggle, setPassMatchToggle] = useState(false);
    const [cookies, , removeCookie] = useCookies();
    const history = useHistory();

    const { userLanguage, clientKey, state, dispatch } = useContext(GlobalContext);
    const { dashboardProfileDict } = useDictionary(clientKey);
    const dictionary = dashboardProfileDict[userLanguage]

    const [warningModal, setWarningModal] = useState({
        show: false,
        message: dictionary['CHANGE_PASSWORD']['WARN_MSG']
    });

    const [message, setMessage] = useState<{ show: boolean, type: string, message: string, }>({
        show: false,
        type: '',
        message: '',
    })
    const [input, setInput] = useState({
        oldPassword: '',
        newPassword: '',
        match: ''
    })

    const toggleModal = () => {
        setWarningModal({
            ...warningModal,
            show: !warningModal.show
        })
    }
    const gotoPasswordReset = async () => {
        try {
            const input = {
                id: state.user.id,
                authId: state.user.authId,
                email: state.user.email,
                lastLoggedOut: new Date().toISOString(),
            };
            API.graphql(graphqlOperation(customMutations.updatePersonLogoutTime, { input }));
            await Auth.signOut();
            updateAuthState(false);
            history.push('/forgot-password');

        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
    async function change() {
        let oldPassword = input.oldPassword;
        let newPassword = input.newPassword;

        try {
            const user = await Auth.currentAuthenticatedUser();
            const passwordChange = await Auth.changePassword(user, oldPassword, newPassword);
            history.push('/dashboard/profile');

        } catch (error) {
            console.error('error signing in', error);
            setMessage(() => {
                switch (error.code) {
                    case "InvalidPasswordException":
                        return {
                            show: true,
                            type: 'error',
                            message: 'Password must be at least 8 characters, include uppercase, lowercase and numbers',
                        }
                    case "NotAuthorizedException":
                        return {
                            show: true,
                            type: 'error',
                            message: 'Your old password is incorrect',
                        }
                    case "LimitExceededException":
                        return {
                            show: true,
                            type: 'error',
                            message: 'The amount of attempts to change your password has been exceeded, please try again after some time',
                        }
                    default:
                        return {
                            show: true,
                            type: 'error',
                            message: 'Make sure your old password is correct and that your new password is at least 8 characters, including uppercase, lowercase and numbers',
                        };
                }

            })


        }
    }


    const validation = () => {

        let validated = false;

        setMessage(() => {
            let oldPassword = input.oldPassword;
            let newPassword = input.newPassword;
            if (!oldPassword) {
                return {
                    show: true,
                    type: 'error',
                    message: dictionary['CHANGE_PASSWORD']["ERRORS"]['NO_OLD_PASS'],
                }

            }
            if (!newPassword) {
                return {
                    show: true,
                    type: 'error',
                    message: dictionary['CHANGE_PASSWORD']["ERRORS"]['NO_NEW_PASS'],
                }
            }
            if (!input.match) {
                return {
                    show: true,
                    type: 'error',
                    message: dictionary['CHANGE_PASSWORD']["ERRORS"]['NO_CONFIRM_PASS'],
                }
            }
            if (input.newPassword !== input.match) {
                return {
                    show: true,
                    type: 'error',
                    message: dictionary['CHANGE_PASSWORD']["ERRORS"]['NOT_MATCH'],
                }
            }
            validated = true;
            if (validated) {
                change();
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
            change()
        }
    }

    const handleSubmit = () => {
        validation();
    }

    return (

        <div className="h-full w-full md:px-4 pt-4">

            <div className="h-auto bg-white shadow-5 sm:rounded-lg mb-4">

                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {dictionary['CHANGE_PASSWORD']['TITLE']}
                    </h3>
                </div>

                <div className="h-full px-4 py-5 sm:px-6 text-gray-800">
                    <div className="text-center text-sm">{dictionary['CHANGE_PASSWORD']['INFO']}</div>
                    <div className="w-full h-auto flex flex-col justify-between items-center my-4">

                        <div className="w-3.27/10 m-1 relative">
                            <div className="border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm flex justify-between items-center">
                                <div style={{ right: 0 }} className="absolute right-0 w-auto mr-2">
                                    <div onClick={() => setOldPassToggle(!oldPassToggle)} className="text-gray-500 cursor-pointer hover:text-grayscale">
                                        {oldPassToggle ?
                                            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                                                <AiOutlineEye />
                                            </IconContext.Provider> :
                                            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                                                <AiOutlineEyeInvisible />
                                            </IconContext.Provider>
                                        }
                                    </div>
                                </div>
                                <div className="w-auto flex justify-center items-center mr-2">
                                    <IconContext.Provider value={{ size: '1.2rem', style: { width: 'auto' } }}>
                                        <FaKey />
                                    </IconContext.Provider>
                                </div>
                                <label className="hidden" htmlFor="oldPassword">{dictionary['CHANGE_PASSWORD']['OLD_PASS']}</label>
                                <input className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder={dictionary['CHANGE_PASSWORD']['OLD_PASS']} type={oldPassToggle ? 'text' : 'password'} id="oldPassword" name="password" defaultValue={input.oldPassword} onChange={handleChange} onKeyDown={handleEnter} />
                            </div>
                        </div>

                        <div className="w-3.27/10 m-1 relative">
                            <div className="border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm flex justify-between items-center">
                                <div style={{ right: 0 }} className="absolute right-0 w-auto mr-2">
                                    <div onClick={() => setPassToggle(!passToggle)} className="text-gray-500 cursor-pointer hover:text-grayscale">
                                        {passToggle ?
                                            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                                                <AiOutlineEye />
                                            </IconContext.Provider> :
                                            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                                                <AiOutlineEyeInvisible />
                                            </IconContext.Provider>
                                        }
                                    </div>
                                </div>
                                <div className="w-auto flex justify-center items-center mr-2">
                                    <IconContext.Provider value={{ size: '1.2rem', style: { width: 'auto' } }}>
                                        <FaKey />
                                    </IconContext.Provider>
                                </div>
                                <label className="hidden" htmlFor="password">{dictionary['CHANGE_PASSWORD']['NEW_PASS']}</label>
                                <input className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder={dictionary['CHANGE_PASSWORD']['NEW_PASS']} type={passToggle ? 'text' : 'password'} id="newPassword" name="password" defaultValue={input.newPassword} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="w-3.27/10 m-1 relative">
                            <div className="border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm flex justify-between items-center">
                                <div style={{ right: 0 }} className="absolute right-0 w-auto mr-2">
                                    <div onClick={() => setPassMatchToggle(!passMatchToggle)} className="text-gray-500 cursor-pointer hover:text-grayscale">
                                        {passMatchToggle ?
                                            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                                                <AiOutlineEye />
                                            </IconContext.Provider> :
                                            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                                                <AiOutlineEyeInvisible />
                                            </IconContext.Provider>
                                        }
                                    </div>
                                </div>
                                <div className="w-auto flex justify-center items-center mr-2">
                                    <IconContext.Provider value={{ size: '1.2rem', style: { width: 'auto' } }}>
                                        <FaKey />
                                    </IconContext.Provider>
                                </div>
                                <label className="hidden" htmlFor="match">{dictionary['CHANGE_PASSWORD']['CONFIRM_PASS']}</label>
                                <input className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder={dictionary['CHANGE_PASSWORD']['CONFIRM_PASS']} type={passMatchToggle ? 'text' : 'password'} id="match" name="match" defaultValue={input.match} onChange={handleChange} />
                            </div>
                        </div>
                    </div>



                    <div className="w-auto text-sm text-center text-gray-600 ">
                        <p className={`hover:text-blue-500 cursor-pointer`} onClick={toggleModal}>{dictionary['CHANGE_PASSWORD']['FORGOT_PASS_LINK']}</p>
                        {warningModal.show && <ModalPopUp closeAction={toggleModal} saveAction={gotoPasswordReset} saveLabel={dictionary['CHANGE_PASSWORD']['CONTINUE_BTN']} message={warningModal.message} />}
                    </div>



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


            <div className="px-4 pt-4 w-full flex justify-center">

                <Buttons
                    btnClass="py-2 w-2.5/10 px-4 text-xs mr-2"
                    label={dictionary['CHANGE_PASSWORD']['CANCEL']}
                    onClick={() => history.push('/dashboard/profile')}
                    transparent
                />
                <Buttons
                    btnClass="py-2 w-2.5/10 px-4 text-xs ml-2"
                    label={dictionary['CHANGE_PASSWORD']['SAVE']}
                    onClick={handleSubmit}
                />
            </div>

        </div>
    )
}

export default ChangePassword;