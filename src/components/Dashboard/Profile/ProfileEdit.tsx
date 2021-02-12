import React, { useState, useContext, useEffect } from 'react';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../customGraphql/customMutations';
import { NavLink, useHistory } from 'react-router-dom';
import DropdownForm from './DropdownForm';
import { UserInfo } from './Profile';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
interface UserInfoProps {
    user: UserInfo
    status: string
    getUser: () => void
    setStatus: React.Dispatch<React.SetStateAction<string>>
}

const ProfileEdit = (props: UserInfoProps) => {
    const history = useHistory();
    const { state, userLanguage, clientKey, dispatch } = useContext(GlobalContext);
    const { dashboardProfileDict } = useDictionary(clientKey);
    const { user, getUser, status, setStatus } = props;
    const [editUser, setEditUser] = useState(user);

    async function updatePerson() {
        const input = {
            id: editUser.id,
            authId: editUser.authId,
            firstName: editUser.firstName,
            grade: editUser.grade,
            image: editUser.image,
            language: editUser.language,
            lastName: editUser.lastName,
            preferredName: editUser.preferredName,
            role: editUser.role,
            status: editUser.status,
            phone: editUser.phone,
            birthdate: editUser.birthdate,
            email: editUser.email,
        }

        try {
            const update: any = await API.graphql(graphqlOperation(customMutations.updatePerson, { input: input }))
            setEditUser(update.data.updatePerson);
            setStatus('loading');
            dispatch({
                type: 'SET_USER',
                payload: {
                    id: state.user.id,
                    firstName: editUser.firstName,
                    lastName: editUser.lastName,
                    language: editUser.language,
                    onBoardSurvey: state.user.onBoardSurvey ? state.user.onBoardSurvey : false,
                    role: state.user.role,
                    image: state.user.image
                }
            })
            history.push('/dashboard/profile');
        } catch (error) {
            console.error(error)
        }
    }

    async function setPerson() {
        const updateUser = await updatePerson();
        const get = await getUser();
    }

    const handleSubmit = (e: any) => {
        setPerson();
        e.preventDefault();
    }

    const onChange = (e: any) => {
        const { id, value } = e.target
        setEditUser(() => {
            return {
                ...editUser,
                [id]: value
            }
        })
    }

    const handleChangeLanguage = (lang: { name: string, code: string }) => {
        setEditUser(() => {
            return {
                ...editUser,
                language: lang.code
            }
        })
    }

    const Language = [
        {
            code: 'EN',
            name: 'English'
        },
        {
            code: 'ES',
            name: 'Spanish'
        }
    ];

    let [imagePreviewURL, setImagePreviewURL] = useState(user.image);
    let imagePreview = null;
    if (imagePreview) {
        imagePreview = <img src={`"${imagePreviewURL}"`} />;
    } else {
        imagePreview =
            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            ;
    }



    if (status !== 'done') {
        return (
            <LessonLoading />
        )
    }
    {
        return (
            <div className="h-full w-full md:px-4 pt-4">
                <form onSubmit={handleSubmit}>

                    <div className="h-auto bg-white shadow-5 sm:rounded-lg mb-4">

                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['TITLE']}
                            </h3>
                        </div>

                        <div className="h-full px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6 text-gray-900">

                                {user.role === 'ST' ?
                                    // what users with STUDENT can see
                                    <>
                                        <div className="sm:col-span-3 p-2">
                                            <label htmlFor="preferredName" className="block text-sm font-medium leading-5 text-gray-700">
                                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['NICKNAME']}
                                            </label>
                                            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                                <input id="preferredName" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                                    defaultValue={user.preferredName}
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 p-2">
                                            <DropdownForm
                                                handleChangeLanguage={handleChangeLanguage}
                                                userLanguage={user.language}
                                                label={dashboardProfileDict[userLanguage]['EDIT_PROFILE']['LANGUAGE']}
                                                items={Language}
                                            />
                                        </div>

                                        <div className="sm:col-span-3 p-2">
                                            <label htmlFor="phone" className="block text-sm font-medium leading-5 text-gray-700">
                                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['CONTACT']}
                                            </label>
                                            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                                <input id="phone" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                                    defaultValue={user.phone}
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 p-2">
                                            <label htmlFor="birthdate" className="block text-sm font-medium leading-5 text-gray-700">
                                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['BIRTHDAY']}
                                            </label>
                                            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                                <input id="birthdate" type="date" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                                    defaultValue={user.birthdate}
                                                />
                                            </div>
                                        </div>
                                    </>

                                    :
                                    // everyone else can see
                                    <>
                                        <div className="sm:col-span-3 p-2">
                                            <label htmlFor="firstName" className="block text-sm font-medium leading-5 text-gray-700">
                                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['FIRST_NAME']}
                                            </label>
                                            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                                <input id="firstName"
                                                    onChange={onChange}
                                                    type="text"
                                                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                                    defaultValue={user.firstName}
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 p-2">
                                            <label htmlFor="lastName" className="block text-sm font-medium leading-5 text-gray-700">
                                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['LAST_NAME']}
                                            </label>
                                            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                                <input id="lastName" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                                    defaultValue={user.lastName} type="text"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 p-2">
                                            <label htmlFor="preferredName" className="block text-sm font-medium leading-5 text-gray-700">
                                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['NICKNAME']}
                                            </label>
                                            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                                <input id="preferredName" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                                    defaultValue={user.preferredName}
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 p-2">
                                            <DropdownForm
                                                handleChangeLanguage={handleChangeLanguage}
                                                userLanguage={user.language}
                                                label={dashboardProfileDict[userLanguage]['EDIT_PROFILE']['LANGUAGE']}
                                                items={Language}
                                            />
                                        </div>

                                        <div className="sm:col-span-3 p-2">
                                            <label htmlFor="phone" className="block text-sm font-medium leading-5 text-gray-700">
                                                {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['CONTACT']}
                                            </label>
                                            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                                <input id="phone" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                                    defaultValue={user.phone}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>
                        </div>


                    </div>

                    {/* <div className="h-auto bg-white shadow-5 sm:rounded-lg">
            
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Edit Institution Information
                    </h3>
                </div>

                <div className="h-full px-4 py-5 sm:px-6">   
                    <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                        <label htmlFor="institution" className="block text-sm font-medium leading-5 text-gray-700">
                            Institution
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="institution" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                            defaultValue={`${user.institution}`}
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="grade" className="block text-sm font-medium leading-5 text-gray-700">
                            Grade
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="grade" onChange={onChange} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                            defaultValue={`${user.grade}`}
                            />
                        </div>
                        </div>
                    </div>
                </div>  
            
            
            </div> */}

                    <div className="px-4 pt-4 w-full flex justify-end">
                        <div className="flex w-4/10">
                            <span className="inline-flex rounded-md shadow-sm">
                                <NavLink to={`/dashboard/profile`}>
                                    <button type="button" className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                                        {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['CANCEL']}
                                    </button>
                                </NavLink>
                            </span>
                            <span className="ml-3 inline-flex rounded-md shadow-5">
                                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['SAVE']}
                                </button>
                            </span>
                        </div>
                    </div>

                </form>
            </div>
        )

    }
}

export default ProfileEdit;