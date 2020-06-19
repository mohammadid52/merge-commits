import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import {
    useHistory,
    Link
} from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Registration = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(GlobalContext);
    const [ input, setInput ] = useState({
        email: '',
        password: '',
    })

    async function signUp() {
        let username = input.email
        let password = input.password
        try {
            const user = await Auth.signUp({
                username,
                password
            });
            console.log({ user });
            dispatch({type: "SET_USER", payload: { user }});
            history.push("/");
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