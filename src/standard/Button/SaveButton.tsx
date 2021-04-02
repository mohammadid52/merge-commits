import React from 'react';

const SaveButton = () => {
    return (
            ///change WIDTH if needed
                <span className="w-4/10 ml-3 flex inline-flex rounded-md shadow-sm">
                    <button type="submit" className="inline-flex justify-center py-2 px-4  border-0 border-transparent text-m leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Save
                    </button>
                </span>
    );
}

export default SaveButton;