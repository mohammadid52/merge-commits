import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import {
    useHistory
} from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Registration = () => {
    const history = useHistory();
    const [ cookies, setCookie ] = useCookies(['confirm_user'])
    const [ input, setInput ] = useState({
        email: '',
        code: '',
    })

    async function confirmSignUp() {
        let username = input.email
        let code = input.code
        try {
            setCookie('confirm_user', input.email);
            let res = await Auth.confirmSignUp(username, code);
            console.log(res)
            history.push('/new-password');
        } catch (error) {
            console.log('error confirming sign up', error);
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
        confirmSignUp()
        console.log('attempt')
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="test login w-140 h-140 bg-gray-200 p-8 flex flex-col items-center justify-around shadow-elem-light rounded">
                <div>
                    <img className="mb-8" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                </div>
                <h1 className="text-5xl font-open font-bold">Confirm Signup</h1>
                <div className="flex-grow flex flex-col py-4">
                    <div className="input">
                        <label className="hidden" htmlFor="email">Email</label>
                        <input className="w-full px-2 py-1 mb-4" placeholder="Email" type="text" id="email" name="email" value={input.email} onChange={handleChange}/>
                    </div>
                    <div className="input">
                        <label className="hidden" htmlFor="code">Confirmation Code</label>
                        <input className="w-full px-2 py-1 mb-4" placeholder="Confirmation Code" type="text" id="code" name="code" value={input.code} onChange={handleChange}/>
                    </div>
                </div>
                <button className="bg-dark-red text-gray-200 rounded shadow-elem-light mb-4" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Registration;