import React from 'react';

const Error = () => {
    
    return (
        ///change INFO, MARGIN and WIDTH if needed
        <div className="rounded-md bg-red-100 p-2">
        <div className="flex">
            <div className="flex-shrink-0 w-8">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            </div>
            <div className="ml-3">
                <h3 className="text-sm leading-5 font-medium text-red-800">
                    There were 2 errors with your submission
                </h3>
                <div className="mt-2 text-sm leading-5 text-red-700">
                    <ul className="list-disc pl-5">
                    <li>
                        Your password must be at least 8 characters
                    </li>
                    <li className="mt-1">
                        Your password must included at least one pro wrestling finishing move
                    </li>
                    </ul>
                </div>
            </div>
            <div className="ml-auto pl-3 w-8">
            <div className="-mx-1.5 -my-1.5">
                <button className="flex justify-end rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:bg-red-100 transition ease-in-out duration-150" aria-label="Dismiss">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                </button>
            </div>
            </div>
        </div>
        </div>
    );

}

export default Error;