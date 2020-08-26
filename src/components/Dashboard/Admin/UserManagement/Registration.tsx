import React, { useState, useContext, useEffect } from 'react';
import { 
    useHistory,
} from 'react-router-dom';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../../../graphql/mutations';
import SuccessNote from '../../../../standard/Alert/SuccessNote';
import ErrorNote from './ErrorNote';
import DropdownForm from './DropdownForm';
import { IconContext } from "react-icons";
import { FaPlus } from 'react-icons/fa'; 

interface newUserInput {
    key: number
    authId: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    birthdate: string
    grade: string
    role: string
    externalId: string
    message: {
        show: boolean
        text: string
        type: string
    }
}

const Registration = () => {
    const history = useHistory();
    const [ newUserInputs, setNewUserInputs ] = useState<newUserInput>(
        {   
            key: 0,
            authId: '',
            email: '',
            password: 'xIconoclast.5x',
            firstName: '',
            lastName: '',
            phone: '',
            birthdate: '',
            grade: '',
            role: '',
            externalId: '',
            message: {
                show: false,
                text: '',
                type: '',
            },
        },
    )

    const [ message, setMessage ] = useState<{show: boolean, type: string, message: string,}>({
        show: false,
        type: '',
        message: '',
    })

    const Role = [
        {
            code: 'ADM',
            name: 'Admin',
        },
        {
            code: 'BLD',
            name: 'Builder',
        },
        {
            code: 'FLW',
            name: 'Fellow',
        },
        {
            code: 'CRD',
            name: 'Coordinator',
        },
        {
            code: 'TR',
            name: 'Teacher',
        },
        {
            code: 'ST',
            name: 'Student',
        },
    ];

    const handleMessage = (type: string, text: string) => {
        setNewUserInputs(() => {
           return {
            ...newUserInputs,
            message: {
                show: true,
                text: text,
                type: type,
            }
        }
        })
    }

    async function registerUser(authId: string) {
        let userData = {
            authId: authId,
            status: 'ACTIVE',
            role: newUserInputs.role,
            email: newUserInputs.email,
            firstName: newUserInputs.firstName,
            lastName: newUserInputs.lastName,
            // insitution: '1',
            phone: newUserInputs.phone,
            birthdate: newUserInputs.birthdate,
            externalId: newUserInputs.externalId,
            grade: newUserInputs.grade,
            language: 'EN',
        }

        try {
            const newPerson = await API.graphql(graphqlOperation(mutations.createPerson, { input: userData }))
            handleMessage('success', 'User registered successfully')
        } catch (error) {
            console.error('error registering user:', error)
            handleMessage('error', error.message)
            
        }
    }

    async function signUp() {
        let username = newUserInputs.email
        let password = newUserInputs.password
        try {
            const user = await Auth.signUp({
                username,
                password
            });
            setNewUserInputs(() => {
                return {
                    ...newUserInputs,
                    authId: user.userSub
                }
            })
            registerUser(user.userSub)
        } catch (error) {
            console.log('error signing up:', error);
            setMessage(() => { 
                if (!newUserInputs.firstName) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'User\'s first name cannot be blank',
                    }
                } else if (!newUserInputs.lastName) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'User\'s last name cannot be blank',
                    }
                } else if (!username) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'User\'s email cannot be blank',
                    }
                } else if (!username.includes("@")) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'User\'s email is not in the expected email address format',
                    }
                } else if (!newUserInputs.birthdate) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'User\'s birthday cannot be blank',
                    }
                } else if (!newUserInputs.role) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'User\'s role cannot be blank',
                    }
                } else if (!newUserInputs.grade) {
                    return {
                        show: true,
                        type: 'error',
                        message: 'User\'s grade cannot be blank',
                    }
                }
                else if (error.message === "InvalidParameterException") {
                    return {
                        show: false,
                        type: 'error',
                        message: '',
                    }
                }
                    return {
                    show: true,
                    type: 'error',
                    message: error.message,
                }
            })
            handleMessage('error', error.message)
            
        }
    }

    // const handleAddInput = () => {
    //     setNewUserInputs(prev => {
    //         return [
    //             ...prev,
    //             {   
    //                 key: newUserInputs.length,
    //                 authId: '',
    //                 email: '',
    //                 password: 'xIconoclast.5x',
    //                 firstName: '',
    //                 lastName: '',
    //                 phone: '',
    //                 birthdate: '',
    //                 grade: '',
    //                 role: '',
    //                 externalId: '',
    //                 message: {
    //                     show: false,
    //                     text: '',
    //                     type: '',
    //                 },
    //             },
    //         ]
    //     })
    // }

    const handleChange = (e: any) => {
        let id = e.target.id
        let value = e.target.value
        setNewUserInputs(() => {
            return {
                ...newUserInputs,
                [id]: value
            }
        })
    }

    const handleChangeRole = (item: {name: string, code: string}) => {
        setNewUserInputs(() => {
            return {
                ...newUserInputs, 
                role: item.code
            }
        })
    }

    const submitNewUsers = () => {
        signUp();
        if (signUp()) {
            setNewUserInputs(() => {
                return {
                    ...newUserInputs
                }
            })
        }
        
    }

    const handleSubmit = (e: any) => {
        submitNewUsers()
    }

    return (

        <div className="w-full h-full p-8 flex items-center justify-center">
            <div className="test w-9/10 bg-gray-200 py-8 px-12 flex flex-col shadow-elem-light border-2 border-gray-300 rounded">
                <div className="w-full flex justify-between">
                    <h1 className="text-3xl font-open font-bold mb-4">
                        Register
                    </h1>
                </div>
                <div className="">
                    
                        <div className="w-full md:flex flex-col mb-8">

                        <div className="h-full w-full bg-white shadow-5 my-4 sm:rounded-lg">
                        <form>

                            <div className="h-full px-4 pb-5 pt-2 sm:px-6">
                                <div className="text-red-500 pb-2 text-right">* Required fields</div>

                                <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6">  
                                    <div className="sm:col-span-3">
                                        <label htmlFor="firstName" className="block text-m font-medium leading-5 text-gray-700">
                                            <span className="text-red-500">*</span> First Name
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                type="text" 
                                                id="firstName"
                                                name="firstName"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                // defaultValue={`${newUserInputs[key].firstName}`}
                                                placeholder="John"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="lastName" className="block text-m font-medium leading-5 text-gray-700">
                                            <span className="text-red-500">*</span> Last Name
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                type="text" 
                                                id="lastName"
                                                name="lastName"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                // defaultValue={`${newUserInputs[key].lastName}`}
                                                placeholder="Doe"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="email" className="block text-m font-medium leading-5 text-gray-700">
                                            <span className="text-red-500">*</span> Email
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                type="email" 
                                                id="email"
                                                name="email"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                // defaultValue={`${newUserInputs[key].email}`}
                                                placeholder="email@email.com"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="birthdate" className="block text-m font-medium leading-5 text-gray-700">
                                            <span className="text-red-500">*</span> Birthday
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                type="date" 
                                                id="birthdate"
                                                name="birthdate"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                // defaultValue={`${newUserInputs[key].birthdate}`}
                                                placeholder="01/01/2010"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <DropdownForm
                                            style = {true}
                                            handleChange = {handleChangeRole}
                                            userInfo = {'Choose One'}
                                            label='Role'
                                            id = 'role'
                                            items= {Role}
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="externalId" className="block text-m font-medium leading-5 text-gray-700">
                                            Student ID
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                type="text" 
                                                id="externalId"
                                                name="externalId"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                // defaultValue={`${newUserInputs[key].externalId}`}
                                                placeholder="student ID"/>
                                        </div>
                                    </div>


                                    <div className="sm:col-span-3">
                                        <label htmlFor="grade" className="block text-m font-medium leading-5 text-gray-700">
                                            <span className="text-red-500">*</span> Grade
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                type="text" 
                                                id="grade"
                                                name="grade"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                // defaultValue={`${newUserInputs[key].grade}`}
                                                placeholder="9"/>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="phone" className="block text-m font-medium leading-5 text-gray-700">
                                            Phone Number
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input  
                                                type="text" 
                                                id="phone"
                                                name="phone"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                // defaultValue={`${newUserInputs[key].phone}`}
                                                placeholder="5551234567"/>
                                        </div>
                                    </div>

                                </div>
                            
                            </div>
                        </form>
                        </div>

                
                            <div className="w-full md:h-full flex justify-center items-center">
                            {
                                message.show ? (
                                    <div>
                                        {newUserInputs.message.type === 'success' ? <SuccessNote /> : 
                                        <ErrorNote 
                                            note={message.message}
                                        />}
                                    </div>
                                        // <div className={`h-1/10 w-6/10 flex justify-center items-center text-sm border-2 ${  newUserInputs[key].message.type === 'success' ? 'text-green-500 bg-green-300  border-green-500' :  newUserInputs[key].message.type === 'error' ? 'text-red-500 bg-red-300  border-red-500' : 'text-gray-200'} py-8 px-4 rounded shadow-elem-light text-center`}>
                                        //     <p>{newUserInputs[key].message.text}</p>
                                        // </div>
                                ) : null
                            }
                            </div>
                        </div>
                  


                </div>
                <div className="w-full flex justify-end">
                    <span className="w-2/10 flex inline-flex rounded-md shadow-sm">
                        <button type="submit" onClick={handleSubmit} className="
                        text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700
                        h-10 inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                            Submit
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Registration;

{/* <div className="w-full flex">
                        <div className="w-3/4 flex flex-col">
                            <div className="flex my-2">
                                <div className="w-1/3 flex flex-col px-2">
                                    <label htmlFor="email">Email</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                                    </div>
                                <div className="w-1/4 flex flex-col px-2">
                                    <label htmlFor="firstName">First name</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="firstName" name="firstName" value={input.firstName} onChange={handleChange}/>
                                </div>
                                <div className="w-1/4 flex flex-col px-2">
                                    <label htmlFor="lastName">Last name</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="lastName" name="lastName" value={input.lastName} onChange={handleChange}/>
                                </div>
                            </div>
                            <div className="flex my-2">
                                <div className="w-1/3 flex flex-col px-2">
                                    <label htmlFor="phone">Phone number</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="phone" name="phone" value={input.phone} onChange={handleChange}/>
                                </div>
                                <div className="w-1/3 flex flex-col px-2">
                                    <label htmlFor="dob">Date of birth</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="dob" name="dob" value={input.dob} onChange={handleChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/4 h-full flex justify-center items-center">
                        {
                            message.show ? (
                                    <div className={`h-1/10 w-6/10 flex justify-center items-center text-sm border-2 ${ message.type === 'success' ? 'text-green-500 bg-green-300  border-green-500' : message.type === 'error' ? 'text-red-500 bg-red-300  border-red-500' : 'text-gray-200'} py-8 px-4 rounded shadow-elem-light text-center`}>
                                        <p>{message.message}</p>
                                    </div>
                            ) : null
                        }
                        </div> */}
                    // </div>