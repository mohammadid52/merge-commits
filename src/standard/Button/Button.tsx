import React from 'react';

interface ButtonProps {
    label: any
}

const Button = (props: ButtonProps ) => {
    const {label} = props;
    
    return (
        ///change the WIDTH, COLOR and TYPE if needed
            <span className="w-4/10 flex inline-flex rounded-md shadow-sm">
                <button type="submit" className="
                text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:ring-indigo active:bg-indigo-700
                inline-flex justify-center py-2 px-4  border-0 border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                   {/* change the label */}
                    {label}
                </button>
            </span>
    );

}

export default Button;