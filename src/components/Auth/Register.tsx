import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import {
    useHistory,
    Link
} from 'react-router-dom';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';


const Registration = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(GlobalContext);
    const [ input, setInput ] = useState({
        id: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        dob: '',
        test: '',
    })

    useEffect(() => {
       if (input.id.length > 1) {registerUser()}
    }, [input.id])

    async function registerUser() {
        let userData = {
            authId: input.id,
            status: 'ACTIVE',
            role: 'FLW',
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
            history.push("/confirm");
        } catch (error) {
            console.error('error registering user:', error)
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
                    id: user.userSub,
                }
            })
            
            // dispatch({type: "SET_USER", payload: { user }});
        } catch (error) {
            console.log('error signing up:', error);
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
            <div className="w-120 h-120 bg-gray-300 p-8 flex flex-col items-center justify-around shadow-elem-dark rounded">
                <h1 className="text-3xl font-open font-bold">Register</h1>
                <div className="flex flex-col justify-around items-center">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={input.password} onChange={handleChange}/>
                    <label htmlFor="firstName">First name</label>
                    <input type="text" id="firstName" name="firstName" value={input.firstName} onChange={handleChange}/>
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" id="lastName" name="lastName" value={input.lastName} onChange={handleChange}/>
                    <label htmlFor="phone">Phone number</label>
                    <input type="text" id="phone" name="phone" value={input.phone} onChange={handleChange}/>
                    <label htmlFor="dob">Date of birth</label>
                    <input type="text" id="dob" name="dob" value={input.dob} onChange={handleChange}/>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p>Already have an account?</p>
                    <Link to="/login">Go to login</Link>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Registration;