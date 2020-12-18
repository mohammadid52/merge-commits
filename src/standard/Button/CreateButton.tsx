import React from 'react';

interface ButtonProps {
    label: any
}

const CreateButton = (props: ButtonProps ) => {
    const {label} = props;
    
    return (
        ///change the WIDTH, COLOR and TYPE if needed
        <span className="w-40 flex inline-flex rounded-md shadow-sm">
            <button type="submit" className="
            text-indigo-700 bg-white border-indigo-700 hover:bg-indigo-600 hover:border-none hover:bg-opacity-50 focus:border-indigo-800 focus:shadow-outline-indigo active:bg-indigo-800
            inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                + Create Name 
            </button>
        </span>
    );

}

export default CreateButton;