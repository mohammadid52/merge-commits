import React, { useState, useContext, useEffect } from 'react';
import { 
    useHistory,
} from 'react-router-dom';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../../graphql/mutations';

const Registration = () => {
    const history = useHistory();
    // const [ message, setMessage ] = useState<Array<{inputNo: number | null, type: string, message: string}>>([
    //     {
    //         inputNo: 0,
    //         message: '',
    //     },
    // ])
    const [ message, setMessage ] = useState<{type: string, show: boolean, message: string}>({
        type: '',
        message: '',
        show: false,
    })
    const [ input, setInput ] = useState({
        inputId: 0,
        authId: '',
        email: '',
        password: 'xIconoclast.5x',
        firstName: '',
        lastName: '',
        phone: '',
        dob: '',
        test: '',
    })

    const handleMessage = (type: string, msg: string) => {
        setMessage(() => {
            return {
                show: true,
                type: type,
                message: msg,
            }
        })
        setTimeout(() => {
            setMessage(message => {
                return {
                    ...message,
                    show: false,
                }
            })
        }, 1000)
    }

    useEffect(() => {
       if (input.authId.length > 1) {registerUser()}
    }, [input.authId])

    async function registerUser() {
        let userData = {
            authId: input.authId,
            status: 'ACTIVE',
            role: 'ADM',
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            // insitution: '1',
            phone: input.phone,
            // birthdate: input.dob,
            language: 'EN',
        }

        try {
            const newPerson = await API.graphql(graphqlOperation(mutations.createPerson, { input: userData }))
            console.log(newPerson)
            handleMessage('success', 'User registered successfully')
        } catch (error) {
            console.error('error registering user:', error)
            handleMessage('error', error.message)
        }
    }

    async function signUp() {
        let username = input.email
        let password = input.password
        try {
            const user = await Auth.signUp({
                username,
                password
            });
            console.log(user.userSub);
            setInput(input => {
                return {
                    ...input,
                    authId: user.userSub,
                }
            })
        } catch (error) {
            console.log('error signing up:', error);
            handleMessage('error', error.message)
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

    const handleSubmit = (e: any) => {
        console.log(input);
        signUp();
        console.log('attempt')
    }

    return (
        <div className="w-full h-200 flex items-center justify-center">
            <div className="w-9/10 h-180 bg-gray-200 py-8 px-12 flex flex-col shadow-elem-light border-2 border-gray-300 rounded">
                <h1 className="text-3xl font-open font-bold mb-4">Register</h1>
                <div className="flex-grow w-full flex flex-col">
                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col">
                            <div className="w-full flex flex-col px-2">
                                <label htmlFor="email">Email</label>
                                <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                            </div>
                            <div className="flex justify-between my-2">
                                <div className="w-full flex flex-col px-2">
                                    <label htmlFor="firstName">First name</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="firstName" name="firstName" value={input.firstName} onChange={handleChange}/>
                                </div>
                                <div className="w-full flex flex-col px-2">
                                    <label htmlFor="lastName">Last name</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="lastName" name="lastName" value={input.lastName} onChange={handleChange}/>
                                </div>
                            </div>
                            <div className="flex justify-between my-2">
                                <div className="w-full flex flex-col px-2">
                                    <label htmlFor="phone">Phone number</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="phone" name="phone" value={input.phone} onChange={handleChange}/>
                                </div>
                                <div className="w-full flex flex-col px-2">
                                    <label htmlFor="dob">Date of birth</label>
                                    <input className="border-b border-gray-400 bg-gray-200 px-2 py-1" type="text" id="dob" name="dob" value={input.dob} onChange={handleChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 h-full flex justify-center items-center">
                        {
                            message.show ? (
                                    <div className={`h-1/10 w-6/10 flex justify-center items-center text-sm border-2 ${ message.type === 'success' ? 'text-green-500 bg-green-300  border-green-500' : message.type === 'error' ? 'text-red-500 bg-red-300  border-red-500' : 'text-gray-200'} py-8 px-4 rounded shadow-elem-light text-center`}>
                                        <p>{message.message}</p>
                                    </div>
                            ) : null
                        }
                        </div>
                    </div>
                </div>
                <button className="self-end w-20 h-8 bg-dark-red text-gray-200 rounded" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Registration;