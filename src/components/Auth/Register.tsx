import React, { useEffect, useState } from 'react';
// import { Auth } from 'aws-amplify';

const Registration = () => {
    const [ input, setInput ] = useState({
        email: '',
        password: '',
    })

    // async function signUp() {
    //     let username = input.email
    //     let password = input.password
    //     try {
    //         const user = await Auth.signUp({
    //             username,
    //             password
    //         });
    //         console.log({ user });
    //     } catch (error) {
    //         console.log('error signing up:', error);
    //     }
    // }


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

        // signUp();

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
                    <input type="text" id="password" name="password" value={input.password} onChange={handleChange}/>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Registration;