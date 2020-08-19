import React from 'react';

interface InputProps {
    label: string,
    id: any,
    value: any,
    type: any
}

const FormInput = (props: InputProps) => {
    const {label, id, value, type} = props;

    return ( 
        ///change
        <div className="sm:col-span-3">
            <label htmlFor={`${id}`} className="block text-m font-medium leading-5 text-gray-700">
                {label}
            </label>
            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                <input id={`${id}`} type={`${type}`} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" defaultValue={`${value}`}/>
            </div>
        </div>
    );

}

export default FormInput;