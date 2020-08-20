import React, { useState, useContext, useEffect } from 'react';
import { 
    useHistory,
} from 'react-router-dom';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../../../graphql/mutations';
import SuccessNote from '../../../../standard/Alert/SuccessNote';
import ErrorNote from './ErrorNote';
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
    const [ newUserInputs, setNewUserInputs ] = useState<Array<newUserInput>>([
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
    ])

    const handleMessage = (key: number, type: string, text: string) => {
        setNewUserInputs(() => {
           let modifiedInputs: Array<newUserInput> = newUserInputs.map((obj: any) => {
                if (key === obj.key) {
                    return {
                        ...obj,
                        message: {
                            show: true,
                            text: text,
                            type: type,
                        }
                    }
                } return obj
           })
           return  modifiedInputs
        })
        // setTimeout(() => {
        //     setNewUserInputs(() => {
        //         let modifiedInputs: Array<newUserInput> = newUserInputs.map((obj: any) => {
        //              if (key === obj.key) {
        //                  return {
        //                     ...obj,
        //                     message: {
        //                         ...obj.message,
        //                         show: false,
        //                     }
        //                  }
        //              } return obj
        //         })
        //         return  modifiedInputs
        //      })
        // }, 2000)
    }

    // useEffect(() => {
    //    if (newUser.authId.length > 1) {registerUser()}
    // }, [newUserInputs])

    async function registerUser(key: number, authId: string) {
        let userData = {
            authId: authId,
            status: 'ACTIVE',
            role: newUserInputs[key].role,
            email: newUserInputs[key].email,
            firstName: newUserInputs[key].firstName,
            lastName: newUserInputs[key].lastName,
            // insitution: '1',
            phone: newUserInputs[key].phone,
            birthdate: newUserInputs[key].birthdate,
            externalId: newUserInputs[key].externalId,
            grade: newUserInputs[key].grade,
            language: 'EN',
        }

        try {
            const newPerson = await API.graphql(graphqlOperation(mutations.createPerson, { input: userData }))
            console.log(newPerson, 'newperson')
            handleMessage(key, 'success', 'User registered successfully')
        } catch (error) {
            console.error('error registering user:', error)
            handleMessage(key, 'error', error.message)
        }
    }

    async function signUp(key: number) {
        let username = newUserInputs[key].email
        let password = newUserInputs[key].password
        try {
            const user = await Auth.signUp({
                username,
                password
            });
            console.log(user.userSub, 'userSub');
            setNewUserInputs(() => {
                let modifiedInputs: Array<newUserInput> = newUserInputs.map((obj: any) => {
                    if (key === obj.key) {
                        return {
                            ...obj,
                            authId: user.userSub
                        }
                    } return obj
                })
                return  modifiedInputs
            })
            registerUser(key, user.userSub)
        } catch (error) {
            console.log('error signing up:', error);
            handleMessage(key, 'error', error.message)
        }
    }

    const handleAddInput = () => {
        setNewUserInputs(prev => {
            return [
                ...prev,
                {   
                    key: newUserInputs.length,
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
            ]
        })
    }

    const handleChange = (e: any) => {
        let id = e.target.id
        let key = e.currentTarget.parentNode.id
        console.log(key, 'key')
        let value = e.target.value
        console.log(key, id, value)
        setNewUserInputs(() => {
            let modifiedInputs: Array<newUserInput> = newUserInputs.map((obj: any) => {
                if (parseInt(key) === obj.key) {
                    return {
                        ...obj,
                        [id]: value,
                    }
                } return obj
            })
            return  modifiedInputs
        })
    }

    const submitNewUsers = () => {
        newUserInputs.forEach((obj: any, key: number) => {
            signUp(key)
        })
    }

    const handleSubmit = (e: any) => {
       
        submitNewUsers()
        console.log(newUserInputs);
        console.log('attempt')
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
                    { newUserInputs.map((input: newUserInput, key: number) => (
                        <div className="w-full md:flex flex-col mb-8" key={key}>

                        <div className="h-full w-full bg-white shadow-5 my-4 sm:rounded-lg">
                        <form>

                            <div className="h-full px-4 py-5 sm:px-6">
                                <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6">

                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="firstName" className="block text-m font-medium leading-5 text-gray-700">
                                            First Name
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="text" 
                                                id="firstName"
                                                name="firstName"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].firstName}`}
                                                placeholder="John"/>
                                        </div>
                                    </div>

                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="lastName" className="block text-m font-medium leading-5 text-gray-700">
                                            Last Name
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="text" 
                                                id="lastName"
                                                name="lastName"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].lastName}`}
                                                placeholder="Doe"/>
                                        </div>
                                    </div>

                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="email" className="block text-m font-medium leading-5 text-gray-700">
                                            Email
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="email" 
                                                id="email"
                                                name="email"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].email}`}
                                                placeholder="email@email.com"/>
                                        </div>
                                    </div>

                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="birthdate" className="block text-m font-medium leading-5 text-gray-700">
                                            Date of Birth
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="date" 
                                                id="birthdate"
                                                name="birthdate"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].birthdate}`}
                                                placeholder="01/01/2010"/>
                                        </div>
                                    </div>

                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="role" className="block text-m font-medium leading-5 text-gray-700">
                                            Role
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="text" 
                                                id="role"
                                                name="role"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].role}`}
                                                placeholder="Student"/>
                                        </div>
                                    </div>

                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="externalId" className="block text-m font-medium leading-5 text-gray-700">
                                            Student ID
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="text" 
                                                id="externalId"
                                                name="externalId"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].externalId}`}
                                                placeholder="student ID"/>
                                        </div>
                                    </div>


                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="grade" className="block text-m font-medium leading-5 text-gray-700">
                                            Grade
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="text" 
                                                id="grade"
                                                name="grade"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].grade}`}
                                                placeholder="9"/>
                                        </div>
                                    </div>

                                    <div id={`${key}`} className="sm:col-span-3">
                                        <label htmlFor="phone" className="block text-m font-medium leading-5 text-gray-700">
                                            Phone Number
                                        </label>
                                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                                            <input 
                                                key={key} 
                                                type="text" 
                                                id="phone"
                                                name="phone"
                                                onChange={handleChange}
                                                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
                                                defaultValue={`${newUserInputs[key].phone}`}
                                                placeholder="5551234567"/>
                                        </div>
                                    </div>

                                </div>
                            
                            </div>
                        </form>
                        </div>

                
                            <div className="w-full md:h-full flex justify-center items-center">
                            {
                                newUserInputs[key].message.show ? (
                                    <div>
                                        {newUserInputs[key].message.type === 'success' ? <SuccessNote /> : 
                                        <ErrorNote 
                                            note={newUserInputs[key].message.text}
                                        />}
                                    </div>
                                        // <div className={`h-1/10 w-6/10 flex justify-center items-center text-sm border-2 ${  newUserInputs[key].message.type === 'success' ? 'text-green-500 bg-green-300  border-green-500' :  newUserInputs[key].message.type === 'error' ? 'text-red-500 bg-red-300  border-red-500' : 'text-gray-200'} py-8 px-4 rounded shadow-elem-light text-center`}>
                                        //     <p>{newUserInputs[key].message.text}</p>
                                        // </div>
                                ) : null
                            }
                            </div>
                        </div>
                    ))}
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