import React, { useState, useContext, useEffect } from 'react';
import { 
    useHistory,
} from 'react-router-dom';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../../../graphql/mutations';
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
    dob: string
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
            dob: '',
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
        setTimeout(() => {
            setNewUserInputs(() => {
                let modifiedInputs: Array<newUserInput> = newUserInputs.map((obj: any) => {
                     if (key === obj.key) {
                         return {
                            ...obj,
                            message: {
                                ...obj.message,
                                show: false,
                            }
                         }
                     } return obj
                })
                return  modifiedInputs
             })
        }, 1000)
    }

    // useEffect(() => {
    //    if (newUser.authId.length > 1) {registerUser()}
    // }, [newUserInputs])

    async function registerUser(key: number, authId: string) {
        let userData = {
            authId: authId,
            status: 'ACTIVE',
            role: 'ADM',
            email: newUserInputs[key].email,
            firstName: newUserInputs[key].firstName,
            lastName: newUserInputs[key].lastName,
            // insitution: '1',
            phone: newUserInputs[key].phone,
            // birthdate: input.dob,
            language: 'EN',
        }

        try {
            const newPerson = await API.graphql(graphqlOperation(mutations.createPerson, { input: userData }))
            console.log(newPerson)
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
            console.log(user.userSub);
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
                    dob: '',
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
        console.log(newUserInputs);
        submitNewUsers()
        console.log('attempt')
    }

    return (

        // <div className="w-full items-center justify-center">
        //     <div className="w-9/10 h-130 ml-4 mt-4 md:m-0 bg-gray-200 py-8 px-12 md:flex flex-col shadow-elem-light border-2 border-gray-300 rounded">
        //         <h1 className="text-3xl font-open font-bold mb-4">Register</h1>
        //         <div className="flex-grow w-full flex flex-col">
        //             <div className="w-full md:flex">
        //                 <div className="md:w-1/2 md:flex flex-col">
        //                     <div className="w-full flex flex-col px-2">
        //                         <label htmlFor="email">Email</label>
        //                         <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
        //                     </div>
        //                     <div className="md:flex justify-between my-2">
        //                         <div className="w-full flex flex-col px-2"></div>


        <div className="w-full h-full p-8 flex items-center justify-center">
            <div className="reg test w-9/10 bg-gray-200 py-8 px-12 flex flex-col shadow-elem-light border-2 border-gray-300 rounded">
                <div className="w-full flex justify-between">
                    <h1 className="text-3xl font-open font-bold mb-4">
                        Register
                    </h1>
                    <IconContext.Provider value={{ color: '#1C2C42', size: '1.5rem', }}>
                        <div onClick={handleAddInput}>
                            <FaPlus/>
                        </div>
                    </IconContext.Provider>
                </div>
                <div className="flex-grow w-full overflow-scroll flex flex-col">
                    { newUserInputs.map((input: newUserInput, key: number) => (
                        <div className="w-full md:flex mb-8" key={key}>
                            <div className="block md:w-3/4 flex md:flex-col">
                                <div className="flex flex-col md:flex-row mr-4 md:mr-0 my-2">
                                    <div id={`${key}`} className="w-full md:w-1/3 flex flex-col mx-2">
                                        <label htmlFor="email">Email</label>
                                        <input key={key} className="border-b border-gray-400 bg-gray-200 px-2 py-1" placeholder="you@email.com" type="text" id="email" name="email" value={newUserInputs[key].email} onChange={handleChange}/>
                                        </div>
                                    <div id={`${key}`} className="w-full md:w-1/3 flex flex-col mx-2">
                                        <label htmlFor="firstName">First name</label>
                                        <input key={key} className="border-b border-gray-400 bg-gray-200 px-2 py-1" placeholder="Jackson" type="text" id="firstName" name="firstName" value={newUserInputs[key].firstName} onChange={handleChange}/>
                                    </div>
                                    <div id={`${key}`} className="w-full md:w-1/3 flex flex-col mx-2">
                                        <label htmlFor="lastName">Last name</label>
                                        <input key={key} className="border-b border-gray-400 bg-gray-200 px-2 py-1" placeholder="Smith" type="text" id="lastName" name="lastName" value={newUserInputs[key].lastName} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row my-2">
                                    <div id={`${key}`}className="w-full md:w-1/3 flex flex-col px-2">
                                        <label htmlFor="phone">Phone number</label>
                                        <input key={key} className="border-b border-gray-400 bg-gray-200 px-2 py-1" placeholder="7031234567" type="text" id="phone" name="phone" value={newUserInputs[key].phone} onChange={handleChange}/>
                                    </div>
                                    <div id={`${key}`} className="w-full md:w-1/3 flex flex-col px-2">
                                        <label htmlFor="dob">Date of birth</label>
                                        <input key={key} className="border-b border-gray-400 bg-gray-200 px-2 py-1" placeholder="MM/DD/YYYY" type="text" id="dob" name="dob" value={newUserInputs[key].dob} onChange={handleChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/4 h-4 md:h-full flex justify-center items-center">
                            {
                                newUserInputs[key].message.show ? (
                                        <div className={`h-1/10 w-6/10 flex justify-center items-center text-sm border-2 ${  newUserInputs[key].message.type === 'success' ? 'text-green-500 bg-green-300  border-green-500' :  newUserInputs[key].message.type === 'error' ? 'text-red-500 bg-red-300  border-red-500' : 'text-gray-200'} py-8 px-4 rounded shadow-elem-light text-center`}>
                                            <p>{newUserInputs[key].message.text}</p>
                                        </div>
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